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

defineOptions({ name: 'SignInPage' })

const email = ref('')
const password = ref('')
/** Заглушка до подключения useSignIn и API */
const isSubmitting = ref(false)

const canSubmit = true;

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

      <div
        class="flex min-h-0 flex-1 flex-col justify-center"
      >
        <div class="mx-auto w-full max-w-[400px]">
          <h1 class="text-heading mb-[24px] text-primary">
            Войти в систему
          </h1>

          <Form @submit="handleSubmit">
            <FormTextInput
              v-model="email"
              label="E-mail"
              type="email"
              placeholder="Введите email"
              autocomplete="email"
              :disabled="isSubmitting"
            />
            <FormPasswordInput
              v-model="password"
              label="Пароль"
              placeholder="Введите пароль"
              autocomplete="current-password"
              :disabled="isSubmitting"
            />

            <Button
              class="mt-2 w-full"
              type="submit"
              variant="primary"
              :disabled="!canSubmit"
              :loading="isSubmitting"
            >
              Войти
            </Button>
          </Form>

          <p class="mt-6 text-center">
            <Link to="/forgot-password">Забыли пароль?</Link>
          </p>
        </div>
      </div>

      <footer class="shrink-0 pt-[32px] pb-[32px] text-center border-t border-stroke">
        <HelperText>
          Ещё не зарегистрированы?
          <Link class="ml-1 inline" to="/sign-up">Регистрация</Link>
        </HelperText>
      </footer>
    </div>

    <template #illustration>
      <Illustration />
    </template>
  </IllustrationLayout>
</template>
