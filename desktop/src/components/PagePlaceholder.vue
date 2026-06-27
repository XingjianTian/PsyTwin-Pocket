<template>
  <section class="page-section">
    <header class="page-section__header">
      <div>
        <p class="page-section__eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p class="page-section__description">{{ description }}</p>
      </div>
      <t-tag
        v-if="badge"
        theme="primary"
        variant="light"
      >
        {{ badge }}
      </t-tag>
    </header>

    <div class="page-section__content">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  badge: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  eyebrow: {
    type: String,
    default: 'Desktop Migration',
  },
  title: {
    type: String,
    required: true,
  },
});
</script>
