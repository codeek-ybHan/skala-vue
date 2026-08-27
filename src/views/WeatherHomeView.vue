<script setup>
import { ref, computed, watch, watchEffect, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KOREA_CITIES } from '../data/koreaCities'
import { fetchCityWeather } from '../api/weather'

import BaseDashboardCard from '../components/BaseDashboardCard.vue'
import SearchBar from '../components/SearchBar.vue'
import KoreaMap from '../components/KoreaMap.vue'
import WeatherCard from '../components/WeatherCard.vue'

const route = useRoute()
const router = useRouter()

const weatherList = ref([])
const viewMode = ref('map')
const searchQuery = ref('')
const statusMessage = ref('카드를 클릭하거나 검색해 보세요')
const selectedCityInfo = ref('')
const isLoading = ref(false)
const isPanelHovered = ref(false)

const fetchRealTimeWeather = async () => {
  isLoading.value = true
  try {
    weatherList.value = await Promise.all(KOREA_CITIES.map(fetchCityWeather))
    console.log('🟢 [API 통신 완료] 메인 대시보드 실시간 기상 장부 동기화:', weatherList.value)
  } catch (error) {
    console.error('🔴 날씨 API 연동 실패:', error)
  } finally {
    isLoading.value = false
  }
}

function toggleViewMode() {
  viewMode.value = viewMode.value === 'map' ? 'card' : 'map'
}

function handleKeydown(event) {
  if (event.key === 'Enter' && isPanelHovered.value) {
    toggleViewMode()
  }
}

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  fetchRealTimeWeather()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

const handleClickDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}
const handleSelectCard = (name) => {
  selectedCityInfo.value = name
}

watch(selectedCityInfo, (newName) => {
  statusMessage.value = newName ? `${newName}이 선택되었습니다.` : '카드를 클릭하거나 검색해 보세요'
  console.log('[watch 감지] 상태바 문구가 업데이트 되었습니다 -> ', statusMessage.value)
})

watchEffect(() => {
  console.log('[watchEffect 자동 호출] 현재 검색어: ', searchQuery.value)
})
</script>

<template>
  <div class="weather">
    <h1>🌤️ DART Weather</h1>

    <BaseDashboardCard>
      <template #header><span class="icon">🔍</span> 도시 검색</template>
      <SearchBar :search-query="searchQuery" @update-query="(value) => (searchQuery = value)" />
    </BaseDashboardCard>

    <BaseDashboardCard @mouseenter="isPanelHovered = true" @mouseleave="isPanelHovered = false">
      <template #header><span class="icon">🏙️</span> 지역별 날씨 현황</template>

      <div class="view-tabs">
        <button type="button" class="view-tab" :class="{ active: viewMode === 'map' }"
          @click="viewMode = 'map'">지도</button>
        <button type="button" class="view-tab" :class="{ active: viewMode === 'card' }"
          @click="viewMode = 'card'">카드</button>
      </div>

      <p v-if="viewMode === 'map'" class="description">
        도시를 클릭하면 해당 도시가 선택되며 날씨 카드가 고정되고, 한번 더 클릭하면 취소됩니다.
      </p>

      <template v-if="filteredWeatherList.length > 0">
        <KoreaMap v-if="viewMode === 'map'" :weather-list="filteredWeatherList"
          @select-card="handleSelectCard" @click-detail="handleClickDetail"/>
        <ul v-else class="city-list">
          <WeatherCard v-for="weather in filteredWeatherList" :key="weather.id" :weather="weather"
            @select-card="handleSelectCard" @click-detail="handleClickDetail" />
        </ul>
      </template>
      <p v-else class="empty-message">'{{ searchQuery }}'와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <BaseDashboardCard>
      <p class="status-banner">{{ statusMessage }}</p>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.weather {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.weather > h1 {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1e3a5f;
}

.icon {
  font-size: 1.1rem;
}

.view-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.view-tab {
  padding: 0.45rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.view-tab:hover {
  background: #e2e8f0;
}

.view-tab.active {
  background: #1e3a5f;
  border-color: #1e3a5f;
  color: #ffffff;
}

.description {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  color: #64748b;
}

.city-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.1rem;
}

.empty-message {
  margin: 0;
  padding: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #64748b;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
}
</style>