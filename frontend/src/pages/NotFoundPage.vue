<script setup lang="ts">
import Logo from '../shared/ui/base/Logo.vue'
import SimpleLayout from '../shared/ui/layout/SimpleLayout.vue'

defineOptions({ name: 'NotFoundPage' })
</script>

<template>
  <SimpleLayout>
    <main class="relative min-h-dvh w-full">
      <header class="absolute left-0 top-0 z-10 px-5 pt-5 md:px-8 md:pt-6">
        <Logo />
      </header>

      <section class="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
        <h1 class="text-heading-2 font-medium text-primary">404</h1>
        <p class="mt-3 text-body text-secondary">
          Что-то пошло не так, страница не найдена. Вернитесь назад.
        </p>
      </section>
    </main>
  </SimpleLayout>
</template>
