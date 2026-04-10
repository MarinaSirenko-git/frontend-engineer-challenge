import { request } from '../api/httpClient'
import { AUTH_PATHS } from '../api/paths'
import type {
  LoginUserRequest,
  LoginHttpResponse,
  RefreshHttpResponse,
  RefreshTokenRequest,
  RegisterUserHttpResponse,
  RegisterUserRequest,
  RequestPasswordResetHttpResponse,
  RequestPasswordResetRequest,
  ResetPasswordHttpResponse,
  ResetPasswordRequest,
} from '../api/types'
import { convertFieldName } from './convertFieldName'

async function postAuth<Response, Body extends object>(
  path: string,
  body: Body,
): Promise<Response> {
  const wireBody = convertFieldName(body, 'toServer')
  const raw = await request<unknown>(path, { method: 'POST', body: wireBody })
  return convertFieldName(raw, 'fromServer') as Response
}

export function register(payload: RegisterUserRequest): Promise<RegisterUserHttpResponse> {
  return postAuth<RegisterUserHttpResponse, RegisterUserRequest>(AUTH_PATHS.register, payload)
}

export function login(payload: LoginUserRequest): Promise<LoginHttpResponse> {
  return postAuth<LoginHttpResponse, LoginUserRequest>(AUTH_PATHS.login, payload)
}

export function refresh(payload: RefreshTokenRequest): Promise<RefreshHttpResponse> {
  return postAuth<RefreshHttpResponse, RefreshTokenRequest>(AUTH_PATHS.refresh, payload)
}

export function requestPasswordReset(
  payload: RequestPasswordResetRequest,
): Promise<RequestPasswordResetHttpResponse> {
  return postAuth<RequestPasswordResetHttpResponse, RequestPasswordResetRequest>(
    AUTH_PATHS.requestPasswordReset,
    payload,
  )
}

export async function resetPassword(
  payload: ResetPasswordRequest,
): Promise<ResetPasswordHttpResponse> {
  // TODO: убрать исключение, когда бекенд примет то же имя поля, что и остальные эндпоинты
  // после `toServer` (например `new_password`), и снова можно будет вызывать `postAuth`.
  const raw = await request<unknown>(AUTH_PATHS.resetPassword, { method: 'POST', body: payload })
  return convertFieldName(raw, 'fromServer') as ResetPasswordHttpResponse
}
