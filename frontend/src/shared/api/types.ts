
// Контракты API в виде, как на фронте после `convertFieldName` (camelCase и согласованные имена полей).


// отправляем на сервер в теле запроса

export interface ApiSuccess<T> {
  success: true
  data: T
}


export interface ApiErrorBody {
  message: string
  status: number
}

export interface RegisterUserRequest {
  email: string
  password: string
}

export interface LoginUserRequest {
  email: string
  password: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RequestPasswordResetRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

// ждём от сервера внутри data
// UUID и даты приходят строками (JSON)

export interface RegisterUserData {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

// Успешные ответы целиком (после нормализации)

export type RegisterUserResponse = ApiSuccess<RegisterUserData>
export type LoginResponse = ApiSuccess<TokenPair>
export type RefreshResponse = ApiSuccess<TokenPair>
export type MessageSuccessResponse = ApiSuccess<string>
export type RegisterUserHttpResponse = RegisterUserResponse
export type LoginHttpResponse = LoginResponse
export type RefreshHttpResponse = RefreshResponse
export type RequestPasswordResetHttpResponse = MessageSuccessResponse
export type ResetPasswordHttpResponse = MessageSuccessResponse
