<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { KOREA_CITIES } from '../data/koreaCities'
import { fetchCityWeather } from '../api/weather'
import { useConfigStore } from '../stores/configStore'
import { convertTemp } from '../utils/temperature'

import BaseDashboardCard from '../components/BaseDashboardCard.vue'

const configStore = useConfigStore()
const route = useRoute()
const weather = ref(null)

onMounted(async () => {
  const cityMeta = KOREA_CITIES.find((city) => city.id === route.params.cityId)
  if (!cityMeta) {
    weather.value = null
    return
  }
  try {
    weather.value = await fetchCityWeather(cityMeta)
  } catch (error) {
    console.error('🔴 상세 날씨 API 연동 실패:', error)
    weather.value = null
  }
})

const displayTemp = computed(() => {
  if (!weather.value) return 0
  return convertTemp(weather.value.temp, configStore.unit)
})
const displayFeelsLike = computed(() => {
  if (!weather.value) return 0
  return convertTemp(weather.value.feelsLike, configStore.unit)
})
</script>

<template>
  <div class="detail">
    <h1>📍 도시 상세 정보</h1>

    <BaseDashboardCard v-if="weather">
      <template #header><span class="icon">🏙️</span> {{ weather.name }}</template>
      <p class="lead">{{ weather.mood }}</p>
      <dl class="detail-meta">
        <div class="detail-meta-row">
          <dt>날씨</dt>
          <dd>{{ weather.status }}</dd>
        </div>
        <div class="detail-meta-row">
          <dt>기온</dt>
          <dd><strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong></dd>
        </div>
        <div class="detail-meta-row">
          <dt>체감 온도</dt>
          <dd>{{ displayFeelsLike }}{{ configStore.unitSymbol }}</dd>
        </div>
        <div class="detail-meta-row">
          <dt>바람</dt>
          <dd>{{ weather.wind }}</dd>
        </div>
      </dl>
      <RouterLink to="/" class="home-link">대시보드로 돌아가기</RouterLink>
    </BaseDashboardCard>

    <BaseDashboardCard v-else>
      <template #header><span class="icon">⚠️</span> {{ route.params.cityId }}</template>
      <p class="lead">해당 도시 정보를 찾을 수 없습니다.</p>
      <RouterLink to="/" class="home-link">대시보드로 돌아가기</RouterLink>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.detail > h1 {
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

.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0 0 1.25rem;
  padding-top: 0.75rem;
  border-top: 1px dashed #cbd5e1;
  font-size: 0.9rem;
  color: #475569;
}

.detail-meta-row {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.detail-meta-row dt {
  color: #94a3b8;
}

.detail-meta-row dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
  color: #0f172a;
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
