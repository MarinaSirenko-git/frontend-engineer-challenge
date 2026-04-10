import { createRouter, createWebHistory } from 'vue-router'
import { setupAuthGuard } from './guards'
import { hasAccessToken } from './sessionAccess'

const SignInPage = () => import('../../pages/SignInPage.vue')
const SignUpPage = () => import('../../pages/SignUpPage.vue')
const ForgotPasswordPage = () => import('../../pages/ForgotPasswordPage.vue')
const ResetPasswordPage = () => import('../../pages/ResetPasswordPage.vue')
const TermsPage = () => import('../../pages/TermsPage.vue')
const PrivacyPage = () => import('../../pages/PrivacyPage.vue')
const DashboardPage = () => import('../../pages/DashboardPage.vue')
const NotFoundPage = () => import('../../pages/NotFoundPage.vue')

/**
 * Мета по плану:
 * - requiresAuth: Dashboard
 * - guestOnly: /sign-in, /sign-up, /forgot-password
 * - public: /reset-password (alias /auth/recovery/new-password), 404 (без редиректов по сессии)
 * - `/`: redirect в зависимости от сессии (см. ниже)
 */

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: () =>
        hasAccessToken() ? { name: 'dashboard' } : { name: 'sign-in' },
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignInPage,
      meta: { guestOnly: true },
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUpPage,
      meta: { guestOnly: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordPage,
      meta: { guestOnly: true },
    },
    {
      path: '/reset-password',
      alias: '/auth/recovery/new-password',
      name: 'reset-password',
      component: ResetPasswordPage,
      meta: { public: true },
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsPage,
      meta: { public: true },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyPage,
      meta: { public: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
      meta: { public: true },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

setupAuthGuard(router)
