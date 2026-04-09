const EMAIL_FORMAT_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LATIN_ONLY_PATTERN = /^[\u0000-\u007F]+$/

export function hasLatinOnly(value: string): boolean {
  return LATIN_ONLY_PATTERN.test(value)
}

export function isValidEmailFormat(value: string): boolean {
  return EMAIL_FORMAT_PATTERN.test(value.trim())
}

/**
 * Возвращает сообщение ошибки для email или `null`, если значение валидно.
 */
export function validateEmail(value: string): string | null {
  const email = value.trim()

  if (!email) return 'Введите email'
  if (!hasLatinOnly(email)) return 'Email должен содержать только латинские символы'
  if (!isValidEmailFormat(email)) return 'Недопустимый адрес почты'

  return null
}
