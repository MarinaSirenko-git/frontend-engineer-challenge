<script setup lang="ts">

</script>

<template>
  <div class="grid min-h-dvh w-full min-w-0 grid-cols-1 lg:grid-cols-[560px_minmax(0,1fr)]">
    <div
      class="flex min-h-dvh min-h-0 flex-col bg-surface max-[450px]:px-4"
    >
      <slot />
    </div>

    <aside class="relative hidden min-h-dvh min-h-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#f4f7fb] to-[#e4eef8] lg:flex"
    >
      <div class="flex size-full max-h-dvh min-h-0 items-center justify-center p-8 lg:p-12">
        <slot name="illustration" />
      </div>
    </aside>
  </div>
</template>
