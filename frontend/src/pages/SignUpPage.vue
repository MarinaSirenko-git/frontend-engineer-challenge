<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '../shared/ui/base/Button.vue'
import HelperText from '../shared/ui/base/HelperText.vue'
import Illustration from '../shared/ui/base/Illustration.vue'
import Link from '../shared/ui/base/Link.vue'
import Logo from '../shared/ui/base/Logo.vue'
import Form from '../shared/ui/form/Form.vue'
import FormPasswordInput from '../shared/ui/form/FormPasswordInput.vue'
import FormTextInput from '../shared/ui/form/FormTextInput.vue'
import IllustrationLayout from '../shared/ui/layout/IllustrationLayout.vue'

defineOptions({ name: 'SignUpPage' })

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
/** Заглушка до подключения useSignUp и API */
const isSubmitting = ref(false)

const canSubmit = true

async function handleSubmit() {
  isSubmitting.value = true
  try {
    await new Promise((r) => setTimeout(r, 400))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <IllustrationLayout>
    <div class="flex min-h-0 flex-1 flex-col">
      <header class="shrink-0 ml-[20px] mt-[20px]">
        <Logo />
      </header>

      <div class="flex min-h-0 flex-1 flex-col justify-center">
        <div class="mx-auto w-full max-w-[400px]">
          <h1 class="text-heading mb-[24px] text-primary">
            Регистрация в системе
          </h1>

          <Form @submit="handleSubmit">
            <FormTextInput
              v-model="email"
              label="E-mail"
              type="email"
              placeholder="Введите e-mail"
              autocomplete="email"
              :disabled="isSubmitting"
            />
            <FormPasswordInput
              v-model="password"
              label="Пароль"
              placeholder="Введите пароль"
              autocomplete="new-password"
              :disabled="isSubmitting"
            />
            <FormPasswordInput
              v-model="confirmPassword"
              label="Повторите пароль"
              placeholder="Повторите пароль"
              autocomplete="new-password"
              :disabled="isSubmitting"
            />

            <Button
              class="mt-2"
              type="submit"
              variant="primary"
              :disabled="!canSubmit"
              :loading="isSubmitting"
            >
              Зарегистрироваться
            </Button>
          </Form>

          <p class="mt-6 text-center text-body-sm text-tertiary">
            Зарегистрировавшись пользователь принимает условия
            <Link class="inline" variant="default" to="/terms">
              договора оферты
            </Link>
            и
            <Link class="inline" variant="default" to="/privacy">
              политики конфиденциальности
            </Link>
          </p>
        </div>
      </div>

      <footer class="shrink-0 pt-[32px] pb-[32px] text-center border-t border-stroke">
        <HelperText>
          Уже есть аккаунт?
          <Link class="ml-1 inline" to="/sign-in">Войти</Link>
        </HelperText>
      </footer>
    </div>

    <template #illustration>
      <Illustration />
    </template>
  </IllustrationLayout>
</template>
