<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'

withDefaults(
  defineProps<{
    to?: RouteLocationRaw
    ariaLabel?: string
  }>(),
  {
    to: '/sign-in',
    ariaLabel: 'Назад',
  },
)
</script>

<template>
  <RouterLink
    :to="to"
    :aria-label="ariaLabel"
    class="inline-flex size-8 items-center justify-center rounded-md text-primary transition-colors hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
  >
    <svg
      class="size-6 shrink-0"
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
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  </RouterLink>
</template>
