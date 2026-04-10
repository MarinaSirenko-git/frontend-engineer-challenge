const LOG_PREFIX = '[Orbitto]'

/**
 * Hook for New Relic (custom events / PageAction / noticeError). No-op until integrated.
 */
export function reportToBackend(_eventName: string, _attributes: Record<string, unknown>): void {}

export function logApiTransportError(method: string, path: string, error: unknown): void {
  const name = error instanceof Error ? error.name : 'UnknownError'
  const message = error instanceof Error ? error.message : String(error)
  reportToBackend('api_transport_error', { method, path, errorName: name })
  console.error(`${LOG_PREFIX} API transport error`, { method, path, name, message })
}

export function logApiServerError(
  method: string,
  path: string,
  status: number,
  message: string,
): void {
  reportToBackend('api_server_error', { method, path, status })
  const short =
    message.length > 200 ? `${message.slice(0, 200)}…` : message
  console.error(`${LOG_PREFIX} API server error`, { method, path, status, message: short })
}

export type MalformedResponseReason = 'json_parse' | 'empty_body'

export function logApiMalformedResponse(
  method: string,
  path: string,
  reason: MalformedResponseReason,
  status: number,
): void {
  reportToBackend('api_malformed_response', { method, path, reason, status })
  console.error(`${LOG_PREFIX} API malformed response`, { method, path, reason, status })
}

export function logRateLimited(method: string, path: string): void {
  reportToBackend('api_rate_limited', { method, path })
  console.warn(`${LOG_PREFIX} API rate limited`, { method, path })
}

export function logPasswordResetTokenRejected(context: {
  reason: 'http_400'
  tokenLength: number
}): void {
  reportToBackend('password_reset_token_rejected', context)
  console.warn(`${LOG_PREFIX} Password reset token rejected`, context)
}
