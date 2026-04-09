import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { register } from '../shared/auth/authApi'
import { isApiHttpError } from '../shared/api/httpClient'
import { normalizeAuthError } from '../shared/auth/normalizeAuthError'
import type { RegisterUserHttpResponse } from '../shared/api/types'
import { validateConfirmPassword } from '../shared/validation/confirmPassword'
import { validateEmail } from '../shared/validation/email'
import { validatePassword } from '../shared/validation/password'

const EMAIL_ALREADY_EXISTS_MESSAGE = 'Данный адрес уже занят'

export type SignUpStatus = 'idle' | 'validationError' | 'submitting' | 'serverError' | 'success'

export interface SignUpFieldErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

interface UseSignUpResult {
  email: Ref<string>
  password: Ref<string>
  confirmPassword: Ref<string>
  fieldErrors: Ref<SignUpFieldErrors>
  generalError: Ref<string>
  isSubmitting: Ref<boolean>
  status: Ref<SignUpStatus>
  validate: () => boolean
  submit: () => Promise<RegisterUserHttpResponse | null>
  resetErrors: () => void
}

export function useSignUp(): UseSignUpResult {
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const fieldErrors = ref<SignUpFieldErrors>({})
  const generalError = ref('')
  const isSubmitting = ref(false)
  const status = ref<SignUpStatus>('idle')

  function resetErrors() {
    fieldErrors.value = {}
    generalError.value = ''
  }

  function validate(): boolean {
    const nextErrors: SignUpFieldErrors = {}
    const emailError = validateEmail(email.value)
    if (emailError) nextErrors.email = emailError

    const passwordError = validatePassword(password.value)
    if (passwordError) nextErrors.password = passwordError

    const confirmPasswordError = validateConfirmPassword(password.value, confirmPassword.value)
    if (confirmPasswordError) nextErrors.confirmPassword = confirmPasswordError

    fieldErrors.value = nextErrors
    const isValid = Object.keys(nextErrors).length === 0
    status.value = isValid ? 'idle' : 'validationError'
    return isValid
  }

  async function submit(): Promise<RegisterUserHttpResponse | null> {
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
      const response = await register({
        email: email.value.trim(),
        password: password.value,
      })
      status.value = 'success'
      return response
    } catch (error: unknown) {
      status.value = 'serverError'

      if (isApiHttpError(error) && error.status === 409) {
        fieldErrors.value = { email: EMAIL_ALREADY_EXISTS_MESSAGE }
        generalError.value = ''
        return null
      }

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
    if (status.value === 'validationError') {
      status.value = 'idle'
    }
    if (generalError.value) {
      generalError.value = ''
    }
  })

  watch(password, () => {
    if (fieldErrors.value.password || fieldErrors.value.confirmPassword) {
      const { password: _passwordError, confirmPassword: _confirmPasswordError, ...rest } =
        fieldErrors.value
      fieldErrors.value = rest
    }
    if (status.value === 'validationError') {
      status.value = 'idle'
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
    if (status.value === 'validationError') {
      status.value = 'idle'
    }
    if (generalError.value) {
      generalError.value = ''
    }
  })

  return {
    email,
    password,
    confirmPassword,
    fieldErrors,
    generalError,
    isSubmitting,
    status,
    validate,
    submit,
    resetErrors,
  }
}
