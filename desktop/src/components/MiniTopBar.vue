<template>
  <header class="mini-topbar">
    <button
      type="button"
      class="mini-topbar__back"
      @click="handleBack"
    >
      <ChevronLeftIcon />
    </button>
    <h1>{{ title }}</h1>
    <div class="mini-topbar__spacer"></div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ChevronLeftIcon } from 'tdesign-icons-vue-next';

const props = defineProps({
  fallback: {
    type: String,
    default: '/home',
  },
  title: {
    type: String,
    required: true,
  },
});

const router = useRouter();

function handleBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push(props.fallback);
}
</script>

<style scoped lang="less">
.mini-topbar {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  height: 52px;
  padding: 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: #ffffff;
}

.mini-topbar h1 {
  margin: 0;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
}

.mini-topbar__back {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  color: rgba(0, 0, 0, 0.8);
  font-size: 22px;
}
</style>
