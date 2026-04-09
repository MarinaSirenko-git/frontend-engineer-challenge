<script setup lang="ts">
const emit = defineEmits<{
  submit: []
}>()

function onSubmit() {
  emit('submit')
}
</script>

<template>
  <form class="flex flex-col w-full gap-[24px]" @submit.prevent="onSubmit">
    <slot />
  </form>
</template>
