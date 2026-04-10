import {
  logApiMalformedResponse,
  logApiServerError,
  logApiTransportError,
  logRateLimited,
} from '../observability/clientLog'
import type { ApiErrorBody } from './types'

const ACCEPT_JSON = 'application/json'
const CONTENT_JSON = 'application/json'

const DEFAULT_API_BASE_URL = 'http://localhost:8080'

function apiBaseUrl(): string {
  const fromEnv = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()
  const raw = fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_API_BASE_URL
  return raw.replace(/\/$/, '')
}

function resolveUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const base = apiBaseUrl()
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

/** Relative path for logs only (no origin / secrets). */
function logPathFromRequestPath(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    try {
      return new URL(path).pathname || '/'
    } catch {
      return '[invalid-url]'
    }
  }
  return path.startsWith('/') ? path : `/${path}`
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== 'object' || value === null) return false
  const o = value as Record<string, unknown>
  return typeof o.message === 'string' && typeof o.status === 'number'
}

export class ApiHttpError extends Error {
  readonly name = 'ApiHttpError'
  readonly status: number
  readonly body?: ApiErrorBody

  constructor(message: string, status: number, body?: ApiErrorBody) {
    super(message)
    this.status = status
    this.body = body
  }
}

export function isApiHttpError(error: unknown): error is ApiHttpError {
  return error instanceof ApiHttpError
}

export type ApiRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function request<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const { body, headers: initHeaders, ...rest } = init
  const methodUpper = (init.method ?? 'GET').toString().toUpperCase()
  const pathForLog = logPathFromRequestPath(path)
  const url = resolveUrl(path)

  const headers = new Headers(initHeaders)
  if (body !== undefined) {
    headers.set('Content-Type', CONTENT_JSON)
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', ACCEPT_JSON)
  }

  let response: Response
  try {
    response = await fetch(url, {
      ...rest,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (error: unknown) {
    logApiTransportError(methodUpper, pathForLog, error)
    throw error
  }

  const raw = await response.text()
  let payload: unknown = undefined
  if (raw.trim()) {
    try {
      payload = JSON.parse(raw) as unknown
    } catch {
      logApiMalformedResponse(methodUpper, pathForLog, 'json_parse', response.status)
      throw new ApiHttpError(
        response.statusText || 'Invalid response',
        response.status,
      )
    }
  }

  if (!response.ok) {
    const bodyParsed = isApiErrorBody(payload) ? payload : undefined
    const message = bodyParsed?.message ?? response.statusText ?? 'Request failed'
    if (response.status >= 500) {
      logApiServerError(methodUpper, pathForLog, response.status, message)
    } else if (response.status === 429) {
      logRateLimited(methodUpper, pathForLog)
    }
    throw new ApiHttpError(message, response.status, bodyParsed)
  }

  const emptySuccessAllowed =
    payload === undefined &&
    (response.status === 204 || methodUpper === 'HEAD')

  if (payload === undefined && !emptySuccessAllowed) {
    logApiMalformedResponse(methodUpper, pathForLog, 'empty_body', response.status)
    throw new ApiHttpError('Empty response body', response.status)
  }

  return payload as T
}

export const httpClient = { request }
