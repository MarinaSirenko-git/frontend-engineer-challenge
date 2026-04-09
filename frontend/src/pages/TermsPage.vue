<script setup lang="ts">
import Link from '../shared/ui/base/Link.vue'

defineOptions({ name: 'TermsPage' })
</script>

<template>
  <main class="mx-auto min-h-dvh w-full max-w-3xl px-5 py-10 md:px-8 md:py-12">
    <header class="mb-8 space-y-3">
      <h1 class="text-heading text-primary">Договор оферты</h1>
      <p class="text-body text-secondary">
        Публичная страница с условиями использования сервиса.
      </p>
    </header>

    <section class="space-y-4 text-body text-primary">
      <p>
        Здесь размещается полный текст оферты: предмет договора, права и
        обязанности сторон, ответственность, условия оплаты, порядок расторжения
        и изменения условий.
      </p>
      <p>
        На этапе MVP можно хранить контент прямо в этой странице. Позже удобно
        вынести текст в CMS или markdown-файл с версионированием.
      </p>
    </section>

    <footer class="mt-10 border-t border-stroke pt-6">
      <Link to="/sign-up">Вернуться к регистрации</Link>
    </footer>
  </main>
</template>
