<template>
  <div class="not-found-page">
    <div class="not-found-page__card">
      <h1>页面不存在</h1>
      <p>当前路由未注册，请返回首页继续测试高保真复刻页面。</p>
      <RouterLink to="/home">返回首页</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
