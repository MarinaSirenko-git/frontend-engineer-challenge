import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { requestPasswordReset } from '../shared/auth/authApi'
import { isApiHttpError } from '../shared/api/httpClient'
import { normalizeAuthError } from '../shared/auth/normalizeAuthError'
import type { RequestPasswordResetHttpResponse } from '../shared/api/types'
import { validateEmail } from '../shared/validation/email'

export type RequestPasswordResetStatus =
  | 'form'
  | 'validationError'
  | 'submitting'
  | 'serverError'
  | 'success'

export interface RequestPasswordResetFieldErrors {
  email?: string
}

interface UseRequestPasswordResetResult {
  email: Ref<string>
  fieldErrors: Ref<RequestPasswordResetFieldErrors>
  generalError: Ref<string>
  isSubmitting: Ref<boolean>
  status: Ref<RequestPasswordResetStatus>
  validate: () => boolean
  submit: () => Promise<RequestPasswordResetHttpResponse | null>
  resetErrors: () => void
}

export function useRequestPasswordReset(): UseRequestPasswordResetResult {
  const email = ref('')
  const fieldErrors = ref<RequestPasswordResetFieldErrors>({})
  const generalError = ref('')
  const isSubmitting = ref(false)
  const status = ref<RequestPasswordResetStatus>('form')

  function resetErrors() {
    fieldErrors.value = {}
    generalError.value = ''
  }

  function validate(): boolean {
    const nextErrors: RequestPasswordResetFieldErrors = {}
    const emailError = validateEmail(email.value)
    if (emailError) nextErrors.email = emailError

    fieldErrors.value = nextErrors
    const isValid = Object.keys(nextErrors).length === 0
    status.value = isValid ? 'form' : 'validationError'
    return isValid
  }

  async function submit(): Promise<RequestPasswordResetHttpResponse | null> {
    if (isSubmitting.value || status.value === 'success') {
      return null
    }

    resetErrors()

    if (!validate()) {
      return null
    }

    status.value = 'submitting'
    isSubmitting.value = true

    try {
      const response = await requestPasswordReset({
        email: email.value.trim(),
      })
      status.value = 'success'
      return response
    } catch (error: unknown) {
      status.value = 'serverError'
      generalError.value = normalizeAuthError(isApiHttpError(error) ? error.body ?? error : error)
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  watch(email, () => {
    if (fieldErrors.value.email) {
      const { email: _emailError, ...rest } = fieldErrors.value
      fieldErrors.value = rest
    }

    if (status.value === 'validationError' || status.value === 'serverError') {
      status.value = 'form'
    }

    if (generalError.value) {
      generalError.value = ''
    }
  })

  return {
    email,
    fieldErrors,
    generalError,
    isSubmitting,
    status,
    validate,
    submit,
    resetErrors,
  }
}
