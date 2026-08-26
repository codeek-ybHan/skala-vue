<script setup>
import { RouterLink } from 'vue-router'
import BaseDashboardCard from '../components/BaseDashboardCard.vue'
</script>

<template>
  <div class="not-found">
    <h1>🧭 페이지를 찾을 수 없어요</h1>

    <BaseDashboardCard>
      <template #header><span class="icon">404</span> Page Not Found</template>
      <p class="lead">요청하신 페이지가 존재하지 않거나 개발 중입니다.</p>
      <RouterLink to="/" class="home-link">대시보드로 돌아가기</RouterLink>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.not-found > h1 {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1e3a5f;
}

.icon {
  font-size: 1.1rem;
}

.lead {
  margin: 0 0 1rem;
  line-height: 1.6;
  color: #334155;
}

.home-link {
  display: inline-block;
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  text-decoration: none;
  background: #1e3a5f;
}
</style>
