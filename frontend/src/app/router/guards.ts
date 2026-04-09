import type { NavigationGuardReturn, Router } from 'vue-router'
import { hasAccessToken } from './sessionAccess'

/**
 * План (plan.md §3) — редиректы в guard:
 * - Роут требует авторизацию, сессии нет → /sign-in
 * - Роут только для гостя, сессия есть → /dashboard
 * Редирект с `/` задан в router/index.ts (redirect).
 */
export function setupAuthGuard(router: Router): void {
  router.beforeEach((to): NavigationGuardReturn => {
    if (to.meta.public) {
      return true
    }

    const authed = hasAccessToken()

    if (to.meta.requiresAuth && !authed) {
      return {
        name: 'sign-in',
        query: { ...to.query, redirect: to.fullPath },
      }
    }

    if (to.meta.guestOnly && authed) {
      return { name: 'dashboard' }
    }

    return true
  })
}
