<script setup lang="ts">
import BackButton from '../../shared/ui/base/BackButton.vue'
import Button from '../../shared/ui/base/Button.vue'
import Form from '../../shared/ui/form/Form.vue'
import FormTextInput from '../../shared/ui/form/FormTextInput.vue'

type ForgotPasswordFormModel = {
  email: string
}

const props = defineProps<{
  model: ForgotPasswordFormModel
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  'update:model': [value: ForgotPasswordFormModel]
  submit: []
}>()

function updateEmail(value: string) {
  emit('update:model', { ...props.model, email: value })
}

function onSubmit() {
  emit('submit')
}
</script>

<template>
  <section class="w-full max-w-[480px]">
    <div class="mb-4 flex items-center gap-2">
      <BackButton to="/sign-in" aria-label="Назад к авторизации" />
      <h1 class="text-heading font-medium text-primary">Восстановление пароля</h1>
    </div>

    <p class="mb-8 text-body text-secondary">
      Укажите адрес почты на который был зарегистрирован аккаунт
    </p>

    <Form @submit="onSubmit">
      <FormTextInput
        :model-value="model.email"
        label="E-mail"
        type="email"
        placeholder="Введите e-mail"
        autocomplete="email"
        :disabled="isSubmitting"
        @update:model-value="updateEmail"
      />

      <Button class="mt-6 w-full" type="submit" variant="secondary" :loading="isSubmitting">
        Восстановить пароль
      </Button>
    </Form>
  </section>
</template>
