import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { login } from '../shared/auth/authApi'
import { isApiHttpError } from '../shared/api/httpClient'
import { normalizeAuthError } from '../shared/auth/normalizeAuthError'
import type { LoginHttpResponse, TokenPair } from '../shared/api/types'
import { validateEmail } from '../shared/validation/email'
import { validatePassword } from '../shared/validation/password'
import { useSessionStore } from '../stores/sessionStore'

const INVALID_CREDENTIALS_MESSAGE = 'Введены неверные данные'

export type SignInStatus = 'idle' | 'validationError' | 'submitting' | 'serverError' | 'success'

export interface SignInFieldErrors {
  email?: string
  password?: string
}

interface UseSignInResult {
  email: Ref<string>
  password: Ref<string>
  fieldErrors: Ref<SignInFieldErrors>
  generalError: Ref<string>
  isSubmitting: Ref<boolean>
  status: Ref<SignInStatus>
  validate: () => boolean
  submit: () => Promise<LoginHttpResponse | null>
  resetErrors: () => void
}

function isInvalidCredentialsStatus(statusCode?: number): boolean {
  return statusCode === 401 || statusCode === 404
}

function isTokenPair(value: unknown): value is TokenPair {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const candidate = value as Partial<TokenPair>
  return (
    typeof candidate.accessToken === 'string' &&
    typeof candidate.refreshToken === 'string' &&
    typeof candidate.tokenType === 'string' &&
    typeof candidate.expiresIn === 'number'
  )
}

type CredentialField = 'email' | 'password'

export function useSignIn(): UseSignInResult {
  const sessionStore = useSessionStore()
  const email = ref('')
  const password = ref('')
  const fieldErrors = ref<SignInFieldErrors>({})
  const generalError = ref('')
  const isSubmitting = ref(false)
  const status = ref<SignInStatus>('idle')

  function resetErrors() {
    fieldErrors.value = {}
    generalError.value = ''
  }

  function validate(): boolean {
    const nextErrors: SignInFieldErrors = {}
    const emailError = validateEmail(email.value)
    if (emailError) nextErrors.email = emailError

    const passwordError = validatePassword(password.value)
    if (passwordError) nextErrors.password = passwordError

    fieldErrors.value = nextErrors
    const isValid = Object.keys(nextErrors).length === 0
    status.value = isValid ? 'idle' : 'validationError'
    return isValid
  }

  async function submit(): Promise<LoginHttpResponse | null> {
    if (isSubmitting.value) {
      return null
    }

    resetErrors()

    if (!validate()) {
      return null
    }

    status.value = 'submitting'
    isSubmitting.value = true

    try {
      const response = await login({
        email: email.value.trim(),
        password: password.value,
      })
      if (isTokenPair(response.data)) {
        sessionStore.setTokenPair(response.data, { email: email.value.trim() })
      }
      status.value = 'success'
      return response
    } catch (error: unknown) {
      status.value = 'serverError'
      const statusCode = isApiHttpError(error) ? error.status : undefined

      if (isInvalidCredentialsStatus(statusCode)) {
        fieldErrors.value = {
          email: INVALID_CREDENTIALS_MESSAGE,
          password: INVALID_CREDENTIALS_MESSAGE,
        }
        generalError.value = ''
        return null
      }

      generalError.value = normalizeAuthError(isApiHttpError(error) ? error.body ?? error : error)
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  function onCredentialFieldChange(field: CredentialField) {
    if (field === 'email' && fieldErrors.value.email) {
      const { email: _emailError, ...rest } = fieldErrors.value
      fieldErrors.value = rest
    }
    if (field === 'password' && fieldErrors.value.password) {
      const { password: _passwordError, ...rest } = fieldErrors.value
      fieldErrors.value = rest
    }
    if (status.value === 'validationError' || status.value === 'serverError') {
      status.value = 'idle'
    }
    if (generalError.value) {
      generalError.value = ''
    }
  }

  watch(email, () => onCredentialFieldChange('email'))
  watch(password, () => onCredentialFieldChange('password'))

  return {
    email,
    password,
    fieldErrors,
    generalError,
    isSubmitting,
    status,
    validate,
    submit,
    resetErrors,
  }
}
