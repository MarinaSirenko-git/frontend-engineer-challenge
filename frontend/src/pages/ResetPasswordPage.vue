<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useResetPassword } from '../composables/useResetPassword'
import Logo from '../shared/ui/base/Logo.vue'
import SimpleLayout from '../shared/ui/layout/SimpleLayout.vue'
import FormView from './reset-password/FormView.vue'
import StatusView from './reset-password/StatusView.vue'

defineOptions({ name: 'ResetPasswordPage' })

const route = useRoute()
const resetPassword = useResetPassword()

const tokenFromQuery = computed(() => {
  const queryToken = route.query.token

  if (typeof queryToken === 'string') return queryToken
  if (Array.isArray(queryToken)) return queryToken[0] ?? ''
  return ''
})

const statusContent = computed(() => {
  if (resetPassword.status.value === 'invalid-link') {
    return {
      title: 'Ссылка недействительна',
      description: 'Проверьте ссылку из письма ещё раз',
      primaryLabel: undefined,
      primaryTo: undefined,
      secondaryLabel: 'Назад в авторизацию',
      secondaryTo: '/sign-in',
    }
  }

  if (resetPassword.status.value === 'success') {
    return {
      title: 'Пароль был восстановлен',
      description: 'Перейдите на страницу авторизации, чтобы войти в систему с новым паролем.',
      primaryLabel: 'Назад в авторизацию',
      primaryTo: '/sign-in',
      secondaryLabel: undefined,
      secondaryTo: undefined,
    }
  }

  return {
    title: 'Пароль не был восстановлен',
    description: 'По каким-то причинам мы не смогли изменить ваш пароль. Попробуйте ещё раз через некоторое время.',
    primaryLabel: 'Назад в авторизацию',
    primaryTo: '/sign-in',
    secondaryLabel: 'Попробовать заново',
    secondaryTo: '/forgot-password',
  }
})

async function handleSubmit() {
  await resetPassword.submit()
}

watch(
  tokenFromQuery,
  (value) => {
    resetPassword.initFromRoute(value)
  },
  { immediate: true },
)
</script>

<template>
  <SimpleLayout>
    <main class="relative min-h-dvh w-full">
      <header class="absolute left-0 top-0 z-10 px-5 pt-5 md:px-8 md:pt-6">
        <Logo />
      </header>

      <div class="flex min-h-dvh items-center justify-center px-5 py-8">
        <FormView
          v-if="resetPassword.status.value === 'form' || resetPassword.status.value === 'validationError'"
          :model="{
            password: resetPassword.password.value,
            confirmPassword: resetPassword.confirmPassword.value,
          }"
          :is-submitting="resetPassword.isSubmitting.value"
          :password-error="resetPassword.fieldErrors.value.password"
          :confirm-password-error="resetPassword.fieldErrors.value.confirmPassword"
          :general-error="resetPassword.generalError.value"
          @update:model="
            (nextModel) => {
              resetPassword.password.value = nextModel.password
              resetPassword.confirmPassword.value = nextModel.confirmPassword
            }
          "
          @submit="handleSubmit"
        />
        <StatusView
          v-else
          :title="statusContent.title"
          :description="statusContent.description"
          :primary-label="statusContent.primaryLabel"
          :primary-to="statusContent.primaryTo"
          :secondary-label="statusContent.secondaryLabel"
          :secondary-to="statusContent.secondaryTo"
        />
      </div>
    </main>
  </SimpleLayout>
</template>
