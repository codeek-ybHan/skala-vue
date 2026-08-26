<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', mood: '산책하기 좋은 날', wind: '3m/s', feelsLike: 30 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', mood: '집콕하기 좋은 날', wind: '5m/s', feelsLike: 23 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', mood: '느긋하게 보내기 좋은 날', wind: '4m/s', feelsLike: 27 },
])

const searchQuery = ref('')
const statusMessage = ref('카드를 클릭하거나 검색해 보세요')
const selectedCityInfo = ref('')
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 ${status}입니다.`)
}

function selectCityInfo(name) {
  selectedCityInfo.value = name
}

watch(selectedCityInfo, (newName) => {
  if (!newName) return
  statusMessage.value = `${newName}이 선택되었습니다.`
  console.log('[watch 감지] 상태바 문구가 업데이트 되었습니다 -> ', statusMessage.value)
})

watchEffect(() => {
  console.log('[watchEffect 자동 호출] 현재 검색어: ', searchQuery.value)
})

const filteredWeatherList = computed(() =>
  weatherList.value.filter((weather) => weather.name.includes(searchQuery.value.trim()))
)
</script>

<template>
  <div class="weather">
    <h1>🌤️ SKALA 날씨 대시보드</h1>

    <BaseDashboardCard>
      <template #header><span class="icon">🔍</span> 도시 검색</template>
      <SearchBar :search-query="searchQuery" @update-query="(value) => (searchQuery = value)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <template #header><span class="icon">🏙️</span> 지역별 날씨 현황</template>
      <ul v-if="filteredWeatherList.length > 0" class="city-list">
        <WeatherCard
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          :weather="weather"
          @select-card="selectCityInfo"
          @click-detail="showDetail"
        />
      </ul>
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