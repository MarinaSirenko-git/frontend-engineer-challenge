import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Доступ только с accessToken (Dashboard) */
    requiresAuth?: boolean
    /** Только для гостя: /sign-in, /sign-up, /forgot-password — при сессии редирект на dashboard */
    guestOnly?: boolean
    /** Публичный маршрут: /reset-password (и alias), 404 — доступен с сессией и без */
    public?: boolean
  }
}

export {}
