<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '../stores/sessionStore'

defineOptions({ name: 'DashboardPage' })

const sessionStore = useSessionStore()

const greeting = computed(() => {
  const email = sessionStore.user?.email
  if (typeof email === 'string' && email.trim()) {
    return `Привет, ${email.trim()}! 👋`
  }
  return 'Привет! 👋'
})
</script>

<template>
  <main id="center">
    <h1>Личный кабинет</h1>
    <p>{{ greeting }}</p>
  </main>
</template>
