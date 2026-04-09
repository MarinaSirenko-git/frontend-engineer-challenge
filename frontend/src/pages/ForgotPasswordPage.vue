<script setup lang="ts">
import { computed, ref } from 'vue'
import Logo from '../shared/ui/base/Logo.vue'
import SimpleLayout from '../shared/ui/layout/SimpleLayout.vue'
import FormView from './forgot-password/FormView.vue'
import StatusView from './forgot-password/StatusView.vue'

defineOptions({ name: 'ForgotPasswordPage' })

const model = ref({ email: '' })
const isSuccess = ref(false)
const isSubmitting = ref(false)

const canSubmit = computed(
  () => model.value.email.trim().length > 0 && !isSubmitting.value,
)
const statusContent = computed(() => ({
  title: 'Проверьте свою почту',
  description: 'Мы отправили на почту письмо с ссылкой для восстановления пароля',
  primaryLabel: 'Назад в авторизацию',
  primaryTo: '/sign-in',
  secondaryLabel: undefined,
  secondaryTo: undefined,
}))

function updateModel(nextModel: { email: string }) {
  model.value = nextModel
}

async function handleSubmit() {
  if (!canSubmit.value || isSuccess.value) return
  isSubmitting.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 400))
    isSuccess.value = true
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
          v-if="!isSuccess"
          :model="model"
          :is-submitting="isSubmitting"
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
