const MIN_PASSWORD_LENGTH = 8

export function hasMinPasswordLength(value: string, min = MIN_PASSWORD_LENGTH): boolean {
  return value.length >= min
}

/**
 * Возвращает сообщение ошибки для пароля или `null`, если значение валидно.
 */
export function validatePassword(value: string): string | null {
  if (!value) return 'Введите пароль.'
  if (!hasMinPasswordLength(value)) return 'Минимум 8 символов'
  return null
}
