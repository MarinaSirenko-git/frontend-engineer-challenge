<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSignIn } from '../composables/useSignIn'
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

const router = useRouter()
const signIn = useSignIn()

async function handleSubmit() {
  const result = await signIn.submit()
  if (result) {
    await router.push('/dashboard')
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
              v-model="signIn.email.value"
              label="E-mail"
              type="email"
              placeholder="Введите email"
              autocomplete="email"
              :error="signIn.fieldErrors.value.email"
              :disabled="signIn.isSubmitting.value"
            />
            <FormPasswordInput
              v-model="signIn.password.value"
              label="Пароль"
              placeholder="Введите пароль"
              autocomplete="current-password"
              :error="signIn.fieldErrors.value.password"
              :disabled="signIn.isSubmitting.value"
            />

            <p
              v-if="signIn.generalError.value"
              class="text-caption text-error"
              role="alert"
              aria-live="polite"
            >
              {{ signIn.generalError.value }}
            </p>

            <Button
              class="mt-2 w-full"
              type="submit"
              variant="primary"
              :disabled="signIn.isSubmitting.value"
              :loading="signIn.isSubmitting.value"
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
