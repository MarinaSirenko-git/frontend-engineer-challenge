<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Logo from '../shared/ui/base/Logo.vue'
import SimpleLayout from '../shared/ui/layout/SimpleLayout.vue'
import FormView from './reset-password/FormView.vue'
import StatusView from './reset-password/StatusView.vue'

defineOptions({ name: 'ResetPasswordPage' })

type ResetPasswordStatus = 'password-restore-success' | 'password-restore-fail'

const route = useRoute()
const model = ref({
  password: '',
  confirmPassword: '',
})
const isSubmitting = ref(false)
const hasValidToken = computed(
  () => typeof route.query.token === 'string' && route.query.token.length > 0,
)

const submitResult = ref<ResetPasswordStatus | null>(null)

const canSubmit = computed(
  () =>
    model.value.password.trim().length > 0 &&
    model.value.confirmPassword.trim().length > 0 &&
    !isSubmitting.value,
)

const statusContent = computed(() => {
  if (!hasValidToken.value) {
    return {
      title: 'Ссылка недействительна',
      description: 'Проверьте ссылку из письма ещё раз',
      primaryLabel: undefined,
      primaryTo: undefined,
      secondaryLabel: 'Назад в авторизацию',
      secondaryTo: '/sign-in',
    }
  }

  if (submitResult.value === 'password-restore-success') {
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

function updateModel(nextModel: { password: string; confirmPassword: string }) {
  model.value = nextModel
}

async function handleSubmit() {
  if (!canSubmit.value || !hasValidToken.value || submitResult.value !== null) return
  isSubmitting.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 400))
    submitResult.value = 'password-restore-success'
  } catch {
    submitResult.value = 'password-restore-fail'
  } finally {
    isSubmitting.value = false
  }
}

</script>

<template>
  <SimpleLayout>
    <main class="relative min-h-dvh w-full">
      <header class="absolute left-0 top-0 z-10 px-5 pt-5 md:px-8 md:pt-6">
        <Logo />
      </header>

      <div class="flex min-h-dvh items-center justify-center px-5 py-8">
        <FormView
          v-if="hasValidToken && submitResult === null"
          :model="model"
          :is-submitting="isSubmitting"
          :can-submit="canSubmit"
          @update:model="updateModel"
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
