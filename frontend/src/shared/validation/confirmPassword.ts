const PASSWORD_MISMATCH_MESSAGE = 'Пароли не совпадают'
const CONFIRM_PASSWORD_REQUIRED_MESSAGE = 'Повторите пароль'

/**
 * Возвращает сообщение ошибки для подтверждения пароля
 * или `null`, если значение валидно.
 */
export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) {
    return CONFIRM_PASSWORD_REQUIRED_MESSAGE
  }

  if (password !== confirmPassword) {
    return PASSWORD_MISMATCH_MESSAGE
  }

  return null
}
