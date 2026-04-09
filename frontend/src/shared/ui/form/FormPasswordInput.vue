<script setup lang="ts">
import { computed, ref, useAttrs, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    placeholder?: string
    error?: string
    disabled?: boolean
    autocomplete?: string
  }>(),
  {
    placeholder: '',
    error: undefined,
    disabled: false,
    autocomplete: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
const baseId = useId()
const inputId = `${baseId}-input`
const errorId = `${baseId}-error`
const toggleId = `${baseId}-toggle`

const showPassword = ref(false)

const showLabel = computed(() => props.modelValue.trim().length > 0)

const hasValue = computed(() => props.modelValue.length > 0)

const inputType = computed(() => (showPassword.value ? 'text' : 'password'))

const inputClass = computed(() => [
  'w-full min-h-[56px] border-b border-stroke pt-5',
  'placeholder:text-tertiary',
  'focus:outline-none',
  'disabled:cursor-not-allowed',
  props.error ? 'border-error' : 'border-accent',
])

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function toggleVisibility() {
  if (props.disabled) return
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="flex w-full flex-col gap-1.5">
    <div class="relative">
      <label
        :for="inputId"
        class="pointer-events-none absolute left-0 top-0 text-body-sm font-medium leading-none text-secondary transition-opacity duration-150"
        :class="showLabel ? 'opacity-100' : 'opacity-0'"
      >
        {{ label }}
      </label>
      <input
        :id="inputId"
        v-bind="attrs"
        :type="inputType"
        :value="modelValue"
        :disabled="disabled"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? errorId : undefined"
        :class="inputClass"
        @input="onInput"
      />
      <button
        v-if="hasValue"
        :id="toggleId"
        type="button"
        class="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-secondary transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50"
        :disabled="disabled"
        :aria-pressed="showPassword"
        :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
        :aria-controls="inputId"
        @mousedown.prevent
        @click="toggleVisibility"
      >
        <!-- Eye open: password hidden -->
        <svg
          v-if="!showPassword"
          class="size-5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <!-- Eye + strike: password visible (hide action) -->
        <svg
          v-else
          class="size-5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path stroke-linecap="round" d="M4 4l16 16" />
        </svg>
      </button>
    </div>
    <p
      v-if="error"
      :id="errorId"
      class="text-caption text-red-600"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </p>
  </div>
</template>
