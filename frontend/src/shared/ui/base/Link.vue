<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'

const props = withDefaults(
  defineProps<{
    to: RouteLocationRaw
    variant?: 'accent' | 'default'
  }>(),
  {
    variant: 'accent',
  },
)

const className = computed(() => {
  if (props.variant === 'default') {
    return 'text-body-sm font-medium text-tertiary underline underline-offset-2 transition-colors hover:text-primary hover:underline active:text-primary'
  }

  return 'text-subtitle font-medium text-accent underline-offset-2 transition-colors hover:text-accent-hover hover:underline active:text-accent-press'
})
</script>

<template>
  <RouterLink
    :to="to"
    :class="className"
  >
    <slot />
  </RouterLink>
</template>
