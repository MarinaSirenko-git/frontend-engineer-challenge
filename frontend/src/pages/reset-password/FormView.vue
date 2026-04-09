<script setup lang="ts">
import Button from '../../shared/ui/base/Button.vue'
import Form from '../../shared/ui/form/Form.vue'
import FormPasswordInput from '../../shared/ui/form/FormPasswordInput.vue'

type ResetPasswordFormModel = {
  password: string
  confirmPassword: string
}

const props = defineProps<{
  model: ResetPasswordFormModel
  isSubmitting: boolean
  passwordError?: string
  confirmPasswordError?: string
  generalError?: string
}>()

const emit = defineEmits<{
  'update:model': [value: ResetPasswordFormModel]
  submit: []
}>()

function updatePassword(value: string) {
  emit('update:model', { ...props.model, password: value })
}

function updateConfirmPassword(value: string) {
  emit('update:model', { ...props.model, confirmPassword: value })
}

function onSubmit() {
  emit('submit')
}
</script>

<template>
  <section class="w-full max-w-[480px]">
    <h1 class="mb-4 text-heading font-medium text-primary">Задайте пароль</h1>

    <p class="mb-8 text-body text-secondary">
      Напишите новый пароль, который будете использовать для входа
    </p>

    <Form @submit="onSubmit">
      <FormPasswordInput
        :model-value="model.password"
        label="Пароль"
        placeholder="Введите пароль"
        autocomplete="new-password"
        :error="passwordError"
        :disabled="isSubmitting"
        @update:model-value="updatePassword"
      />

      <FormPasswordInput
        :model-value="model.confirmPassword"
        label="Повторите пароль"
        placeholder="Повторите пароль"
        autocomplete="new-password"
        :error="confirmPasswordError"
        :disabled="isSubmitting"
        @update:model-value="updateConfirmPassword"
      />

      <p
        v-if="generalError"
        class="mt-3 text-caption text-error"
        role="alert"
        aria-live="polite"
      >
        {{ generalError }}
      </p>

      <Button
        class="mt-6 w-full"
        type="submit"
        variant="primary"
        :disabled="isSubmitting"
        :loading="isSubmitting"
      >
        Изменить пароль
      </Button>
    </Form>
  </section>
</template>
