<script setup lang="ts">
import Link from '../shared/ui/base/Link.vue'

defineOptions({ name: 'PrivacyPage' })
</script>

<template>
  <main class="mx-auto min-h-dvh w-full max-w-3xl px-5 py-10 md:px-8 md:py-12">
    <header class="mb-8 space-y-3">
      <h1 class="text-heading text-primary">Политика конфиденциальности</h1>
      <p class="text-body text-secondary">
        Публичная страница с правилами обработки персональных данных.
      </p>
    </header>

    <section class="space-y-4 text-body text-primary">
      <p>
        Здесь указываются категории собираемых данных, цели обработки, сроки
        хранения, правовые основания и права пользователя на доступ, исправление
        и удаление данных.
      </p>
      <p>
        Также обычно добавляют контакты оператора персональных данных и раздел о
        cookie-файлах/аналитике.
      </p>
    </section>

    <footer class="mt-10 border-t border-stroke pt-6">
      <Link to="/sign-up">Вернуться к регистрации</Link>
    </footer>
  </main>
</template>
