<template>
  <section class="mini-page">
    <header class="mini-page__header">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </header>
    <div class="mini-page__card">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  description: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
});
</script>
