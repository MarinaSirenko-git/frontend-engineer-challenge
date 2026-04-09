<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' 
    disabled?: boolean
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    disabled: false,
    loading: false,
    type: 'button',
  },
)

const isDisabled = computed(() => props.disabled || props.loading)

const className = computed(() => {
  const base =
    'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-button font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none cursor-pointer'

  const variants: Record<typeof props.variant, string> = {
    primary:
      'text-white bg-accent hover:bg-accent-hover active:bg-accent-press disabled:bg-accent-disabled',
    secondary:
      'text-accent bg-btn-secondary hover:bg-btn-secondary-hover active:bg-btn-secondary-press disabled:bg-btn-secondary-disabled',
  }

  const state = props.loading ? 'cursor-wait opacity-90' : ''

  return [base, variants[props.variant], state].filter(Boolean).join(' ')
})
</script>

<template>
  <button
    :class="className"
    :type="type"
    :disabled="isDisabled"
    :aria-busy="loading || undefined"
    :aria-disabled="isDisabled || undefined"
  >
    <span v-if="loading" class="size-4 animate-pulse rounded-full bg-current/30" aria-hidden="true" />
    <slot />
  </button>
</template>
