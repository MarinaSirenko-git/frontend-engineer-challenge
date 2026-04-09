import type { ApiErrorBody } from '../api/types'

/** Запасные тексты по статусу, если тела ошибки нет или `message` пустой */
const FALLBACK_BY_STATUS: Record<number, string> = {
  400: 'Запрос отклонён. Проверьте данные или повторите попытку позже.',
  401: 'Неверный email или пароль.',
  403: 'Доступ запрещён.',
  404: 'Ресурс не найден.',
  409: 'Этот email уже зарегистрирован.',
  422: 'Проверьте введённые данные.',
  429: 'Слишком много запросов. Подождите и попробуйте снова.',
  500: 'Сервис временно недоступен. Попробуйте позже.',
  503: 'Сервис временно недоступен. Попробуйте позже.',
}

const DEFAULT_MESSAGE = 'Не удалось выполнить действие. Попробуйте ещё раз.'

/** Типичные сообщения `fetch` / браузера о сети (англ. локаль) */
const NETWORK_ERROR_PATTERN =
  /failed to fetch|networkerror|load failed|network request failed/i

function trimMessage(value: string): string {
  return value.trim()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (!isRecord(value)) return false
  return typeof value.message === 'string' && typeof value.status === 'number'
}

function messageLooksLikeNetworkError(message: string): boolean {
  return NETWORK_ERROR_PATTERN.test(message)
}

/**
 * Возвращает короткое сообщение для пользователя.
 * Порядок: непустое `message` с сервера → сеть (`TypeError` / текст) → текст по HTTP-статусу → общий fallback.
 */
export function normalizeAuthError(error: unknown): string {
  if (error == null) {
    return DEFAULT_MESSAGE
  }

  if (typeof error === 'string') {
    const t = trimMessage(error)
    return t || DEFAULT_MESSAGE
  }

  if (error instanceof Error) {
    const raw = trimMessage(error.message)
    if (raw && messageLooksLikeNetworkError(raw)) {
      return 'Нет подключения к сети. Проверьте интернет и попробуйте снова.'
    }
    if (raw) return raw
    return DEFAULT_MESSAGE
  }

  if (isApiErrorBody(error)) {
    const t = trimMessage(error.message)
    if (t) return t
    return FALLBACK_BY_STATUS[error.status] ?? DEFAULT_MESSAGE
  }

  if (isRecord(error) && typeof error.status === 'number') {
    const msg = error.message
    if (typeof msg === 'string') {
      const t = trimMessage(msg)
      if (t) return t
    }
    return FALLBACK_BY_STATUS[error.status] ?? DEFAULT_MESSAGE
  }

  return DEFAULT_MESSAGE
}
