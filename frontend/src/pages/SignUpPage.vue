<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSignUp } from '../composables/useSignUp'
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

const router = useRouter()
const signUp = useSignUp()

async function handleSubmit() {
  const result = await signUp.submit()
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

      <div class="flex min-h-0 flex-1 flex-col justify-center">
        <div class="mx-auto w-full max-w-[400px]">
          <h1 class="text-heading mb-[24px] text-primary">
            Регистрация в системе
          </h1>

          <Form @submit="handleSubmit">
            <FormTextInput
              v-model="signUp.email.value"
              label="E-mail"
              type="email"
              placeholder="Введите e-mail"
              autocomplete="email"
              :error="signUp.fieldErrors.value.email"
              :disabled="signUp.isSubmitting.value"
            />
            <FormPasswordInput
              v-model="signUp.password.value"
              label="Пароль"
              placeholder="Введите пароль"
              autocomplete="new-password"
              :has-error="
                Boolean(signUp.fieldErrors.value.password || signUp.fieldErrors.value.confirmPassword)
              "
              :error="signUp.fieldErrors.value.password"
              :disabled="signUp.isSubmitting.value"
            />
            <FormPasswordInput
              v-model="signUp.confirmPassword.value"
              label="Повторите пароль"
              placeholder="Повторите пароль"
              autocomplete="new-password"
              :has-error="Boolean(signUp.fieldErrors.value.confirmPassword)"
              :error="signUp.fieldErrors.value.confirmPassword"
              :disabled="signUp.isSubmitting.value"
            />

            <p
              v-if="signUp.generalError.value"
              class="text-caption text-error"
              role="alert"
              aria-live="polite"
            >
              {{ signUp.generalError.value }}
            </p>

            <Button
              class="mt-2"
              type="submit"
              variant="primary"
              :disabled="signUp.isSubmitting.value"
              :loading="signUp.isSubmitting.value"
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
