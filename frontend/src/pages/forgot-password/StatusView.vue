<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import Button from '../../shared/ui/base/Button.vue'
import Link from '../../shared/ui/base/Link.vue'
import AuthStatus from '../../shared/ui/form/AuthStatus.vue'

const props = defineProps<{
  title: string
  description: string
  primaryLabel: string
  primaryTo: RouteLocationRaw
  secondaryLabel?: string
  secondaryTo?: RouteLocationRaw
}>()

const router = useRouter()

function handlePrimaryAction() {
  router.push(props.primaryTo)
}
</script>

<template>
  <section class="w-full max-w-[480px]">
    <AuthStatus class="text-center">
      <h1 class="text-heading font-medium text-primary text-left">{{ props.title }}</h1>
      <p class="mt-5 text-body text-secondary text-left">{{ props.description }}</p>
      <Button class="mt-8 w-full" variant="secondary" @click="handlePrimaryAction">
        {{ props.primaryLabel }}
      </Button>
      <Link v-if="props.secondaryLabel && props.secondaryTo" :to="props.secondaryTo" variant="default">
        {{ props.secondaryLabel }}
      </Link>
    </AuthStatus>
  </section>
</template>
