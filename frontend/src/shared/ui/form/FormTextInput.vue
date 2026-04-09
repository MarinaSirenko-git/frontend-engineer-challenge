<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    placeholder?: string
    type?: string
    error?: string
    disabled?: boolean
    autocomplete?: string
  }>(),
  {
    placeholder: '',
    type: 'text',
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

const showLabel = computed(() => props.modelValue.trim().length > 0)

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
        :type="type"
        :value="modelValue"
        :disabled="disabled"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? errorId : undefined"
        :class="inputClass"
        @input="onInput"
      />
    </div>
    <p
      v-if="error"
      :id="errorId"
      class="text-caption text-error"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </p>
  </div>
</template>
