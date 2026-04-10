import { defineStore } from 'pinia'
import type { RegisterUserData, SessionSnapshot, SessionUser, TokenPair } from '../shared/api/types'

const SESSION_STORAGE_KEY = 'orbitto.session.v1'
const EXPIRY_SAFETY_BUFFER_MS = 5000

type JwtPayload = Record<string, unknown>

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function decodeBase64Url(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return atob(padded)
  } catch {
    return null
  }
}

function parseJwtPayload(token: string): JwtPayload | null {
  const chunks = token.split('.')
  if (chunks.length < 2) return null

  const decoded = decodeBase64Url(chunks[1] ?? '')
  if (!decoded) return null

  try {
    const parsed = JSON.parse(decoded) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    return parsed as JwtPayload
  } catch {
    return null
  }
}

function userFromJwtPayload(payload: JwtPayload | null): SessionUser | null {
  if (!payload) return null

  const user: SessionUser = { ...payload }

  if (typeof payload.sub === 'string' && !user.id) {
    user.id = payload.sub
  }
  if (typeof payload.email !== 'string') {
    delete user.email
  }

  return user
}

/** Backend JWT часто не содержит email — подмешиваем сохранённый профиль после логина / из localStorage. */
function mergeSessionUser(jwtUser: SessionUser | null, profile: SessionUser | null): SessionUser | null {
  if (!jwtUser) return profile
  const jwtEmail =
    typeof jwtUser.email === 'string' && jwtUser.email.trim().length > 0 ? jwtUser.email.trim() : ''
  const profileEmail =
    profile &&
    typeof profile.email === 'string' &&
    profile.email.trim().length > 0
      ? profile.email.trim()
      : ''
  const email = jwtEmail || profileEmail
  return email ? { ...jwtUser, email } : jwtUser
}

function readPersisted(): SessionSnapshot | null {
  if (!isBrowser()) return null

  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    const c = parsed as Partial<SessionSnapshot> & { user?: unknown }

    const user =
      c.user &&
      typeof c.user === 'object' &&
      !Array.isArray(c.user) &&
      typeof (c.user as SessionUser).id === 'string'
        ? (c.user as SessionUser)
        : null

    return {
      accessToken: typeof c.accessToken === 'string' ? c.accessToken : null,
      refreshToken: typeof c.refreshToken === 'string' ? c.refreshToken : null,
      tokenType: typeof c.tokenType === 'string' ? c.tokenType : null,
      expiresAt: typeof c.expiresAt === 'number' ? c.expiresAt : null,
      user,
    }
  } catch {
    return null
  }
}

interface SessionState {
  accessToken: string | null
  refreshToken: string | null
  tokenType: string | null
  expiresAt: number | null
  user: SessionUser | null
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    accessToken: null,
    refreshToken: null,
    tokenType: null,
    expiresAt: null,
    user: null,
  }),

  getters: {
    isTokenExpired(): boolean {
      if (!this.expiresAt) return true
      return this.expiresAt - EXPIRY_SAFETY_BUFFER_MS <= Date.now()
    },

    isAuthenticated(): boolean {
      return Boolean(this.accessToken) && !this.isTokenExpired
    },
  },

  actions: {
    persist() {
      if (!isBrowser()) return

      const snapshot: SessionSnapshot = {
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        tokenType: this.tokenType,
        expiresAt: this.expiresAt,
        user: this.user,
      }
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot))
    },

    clearPersisted() {
      if (!isBrowser()) return
      window.localStorage.removeItem(SESSION_STORAGE_KEY)
    },

    setTokenPair(pair: TokenPair, options?: { email?: string }) {
      const previousUser = this.user
      this.accessToken = pair.accessToken
      this.refreshToken = pair.refreshToken
      this.tokenType = pair.tokenType
      this.expiresAt = Date.now() + pair.expiresIn * 1000
      const fromJwt = userFromJwtPayload(parseJwtPayload(pair.accessToken))
      const fromForm = (options?.email ?? '').trim()
      const fromSession =
        previousUser && typeof previousUser.email === 'string' ? previousUser.email.trim() : ''
      const emailHint = fromForm || fromSession
      this.user = emailHint ? mergeSessionUser(fromJwt, { email: emailHint }) : fromJwt
      this.persist()
    },

    setUserFromRegister(data: RegisterUserData) {
      this.user = {
        id: data.id,
        email: data.email,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }
      this.persist()
    },

    clearSession() {
      this.accessToken = null
      this.refreshToken = null
      this.tokenType = null
      this.expiresAt = null
      this.user = null
      this.clearPersisted()
    },

    restoreSession() {
      const snapshot = readPersisted()

      if (!snapshot) {
        this.clearSession()
        return
      }

      const hasTokens =
        snapshot.accessToken && snapshot.refreshToken && snapshot.expiresAt != null

      if (hasTokens) {
        this.accessToken = snapshot.accessToken
        this.refreshToken = snapshot.refreshToken
        this.tokenType = snapshot.tokenType
        this.expiresAt = snapshot.expiresAt

        if (this.isTokenExpired) {
          this.clearSession()
          return
        }

        const fromJwt = userFromJwtPayload(parseJwtPayload(this.accessToken!))
        this.user = mergeSessionUser(fromJwt, snapshot.user) ?? snapshot.user
        this.persist()
        return
      }

      if (snapshot.accessToken || snapshot.refreshToken || snapshot.expiresAt) {
        this.clearSession()
        return
      }

      this.user = snapshot.user
      this.accessToken = null
      this.refreshToken = null
      this.tokenType = null
      this.expiresAt = null
      this.persist()
    },
  },
})
