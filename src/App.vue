<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/UnitToggler.vue'
</script>

<template>
  <nav class="tab-nav">
    <RouterLink to="/" class="tab-link">대시보드</RouterLink>
    <RouterLink to="/company" class="tab-link">기업 날씨</RouterLink>
    <RouterLink to="/about" class="tab-link">서비스 소개</RouterLink>
    <UnitToggler />
  </nav>
  <RouterView />
</template>

<style scoped>
.tab-nav {
  display: flex;
  gap: 0.5rem;
  max-width: 1100px;
  margin: 0 auto 1.5rem;
}

.tab-link {
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  transition: background 0.15s, color 0.15s;
}

.tab-link:hover {
  background: #e2e8f0;
}

.tab-link.router-link-exact-active {
  background: #1e3a5f;
  border-color: #1e3a5f;
  color: #ffffff;
}
</style>
