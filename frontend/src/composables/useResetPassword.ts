import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { resetPassword } from '../shared/auth/authApi'
import { isApiHttpError } from '../shared/api/httpClient'
import { normalizeAuthError } from '../shared/auth/normalizeAuthError'
import type { ResetPasswordHttpResponse } from '../shared/api/types'
import { validateConfirmPassword } from '../shared/validation/confirmPassword'
import { validatePassword } from '../shared/validation/password'

export type ResetPasswordStatus = 'invalid-link' | 'form' | 'success' | 'fail'

export interface ResetPasswordFieldErrors {
  password?: string
  confirmPassword?: string
}

interface UseResetPasswordResult {
  token: Ref<string>
  password: Ref<string>
  confirmPassword: Ref<string>
  fieldErrors: Ref<ResetPasswordFieldErrors>
  generalError: Ref<string>
  isSubmitting: Ref<boolean>
  status: Ref<ResetPasswordStatus>
  initFromRoute: (tokenFromQuery: string | null | undefined) => void
  validate: () => boolean
  submit: () => Promise<ResetPasswordHttpResponse | null>
  resetErrors: () => void
}

function normalizeToken(tokenFromQuery: string | null | undefined): string {
  return (tokenFromQuery ?? '').trim()
}

export function useResetPassword(): UseResetPasswordResult {
  const token = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const fieldErrors = ref<ResetPasswordFieldErrors>({})
  const generalError = ref('')
  const isSubmitting = ref(false)
  const status = ref<ResetPasswordStatus>('invalid-link')

  function resetErrors() {
    fieldErrors.value = {}
    generalError.value = ''
  }

  function initFromRoute(tokenFromQuery: string | null | undefined): void {
    token.value = normalizeToken(tokenFromQuery)
    resetErrors()
    status.value = token.value ? 'form' : 'invalid-link'
  }

  function validate(): boolean {
    const nextErrors: ResetPasswordFieldErrors = {}

    const passwordError = validatePassword(password.value)
    if (passwordError) nextErrors.password = passwordError

    const confirmPasswordError = validateConfirmPassword(password.value, confirmPassword.value)
    if (confirmPasswordError) nextErrors.confirmPassword = confirmPasswordError

    fieldErrors.value = nextErrors
    return Object.keys(nextErrors).length === 0
  }

  async function submit(): Promise<ResetPasswordHttpResponse | null> {
    if (isSubmitting.value || status.value === 'invalid-link' || !token.value) {
      return null
    }

    resetErrors()

    if (!validate()) {
      return null
    }

    isSubmitting.value = true

    try {
      const response = await resetPassword({
        token: token.value,
        newPassword: password.value,
      })
      status.value = 'success'
      return response
    } catch (error: unknown) {
      const statusCode = isApiHttpError(error) ? error.status : undefined

      if (statusCode === 400) {
        status.value = 'fail'
      } else {
        status.value = 'form'
        generalError.value = normalizeAuthError(isApiHttpError(error) ? error.body ?? error : error)
      }

      return null
    } finally {
      isSubmitting.value = false
    }
  }

  watch(password, () => {
    if (fieldErrors.value.password || fieldErrors.value.confirmPassword) {
      const { password: _passwordError, confirmPassword: _confirmPasswordError, ...rest } =
        fieldErrors.value
      fieldErrors.value = rest
    }
    if (generalError.value) {
      generalError.value = ''
    }
  })

  watch(confirmPassword, () => {
    if (fieldErrors.value.confirmPassword) {
      const { confirmPassword: _confirmPasswordError, ...rest } = fieldErrors.value
      fieldErrors.value = rest
    }
    if (generalError.value) {
      generalError.value = ''
    }
  })

  return {
    token,
    password,
    confirmPassword,
    fieldErrors,
    generalError,
    isSubmitting,
    status,
    initFromRoute,
    validate,
    submit,
    resetErrors,
  }
}
