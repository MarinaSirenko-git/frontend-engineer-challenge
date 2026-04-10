<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import Button from '../../shared/ui/base/Button.vue'
import Link from '../../shared/ui/base/Link.vue'
import AuthStatus from '../../shared/ui/form/AuthStatus.vue'

const props = defineProps<{
  title: string
  description: string
  primaryLabel?: string
  primaryTo?: RouteLocationRaw
  secondaryLabel?: string
  secondaryTo?: RouteLocationRaw
}>()

const router = useRouter()

function hasVisibleLabel(label: string | undefined): boolean {
  return typeof label === 'string' && label.trim().length > 0
}

const hasPrimaryAction = computed(
  () => hasVisibleLabel(props.primaryLabel) && Boolean(props.primaryTo),
)

const hasSecondaryAction = computed(
  () => hasVisibleLabel(props.secondaryLabel) && Boolean(props.secondaryTo),
)

function handlePrimaryAction() {
  if(props.primaryTo) router.push(props.primaryTo)
}
</script>

<template>
  <section class="w-full max-w-[480px]">
    <AuthStatus class="text-center">
      <h1 class="text-heading font-medium text-primary text-left">{{ props.title }}</h1>
      <p class="mt-3 text-body text-secondary text-left">{{ props.description }}</p>

      <div class="mt-8 flex flex-col gap-3">
        <Button v-if="hasPrimaryAction" class="w-full" variant="secondary" @click="handlePrimaryAction">
          {{ props.primaryLabel }}
        </Button>
        <Link v-if="hasSecondaryAction" :to="props.secondaryTo!" variant="default">
          {{ props.secondaryLabel }}
        </Link>
      </div>
    </AuthStatus>
  </section>
</template>
