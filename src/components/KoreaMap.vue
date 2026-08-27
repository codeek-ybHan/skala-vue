<script setup>
import { ref } from 'vue'
import WeatherCard from './WeatherCard.vue'
import koreaMapSvg from '../assets/korea-map.svg?raw'

defineProps({
  weatherList: {
    type: Array,
    required: true,
  },
})
defineEmits(['select-card', 'click-detail'])

// 위키미디어 남한 지도(viewBox 800x1200) 시/도 폴리곤 중심 좌표 기준, 라벨끼리 겹치지 않도록 서울/인천/수원 군집만 소폭 보정 (%)
const CITY_POSITIONS = {
  city_01: { top: 18, left: 34 }, // 서울
  city_02: { top: 27, left: 33 }, // 수원 (경기, 서울 남쪽 인근 추정치)
  city_03: { top: 62.5, left: 77.3 }, // 부산
  city_04: { top: 20, left: 19 }, // 인천
  city_05: { top: 41.9, left: 41.6 }, // 대전
  city_06: { top: 52.0, left: 64.9 }, // 대구
  city_07: { top: 63.0, left: 28.6 }, // 광주
}
const DEFAULT_POSITION = { top: 50, left: 50 }

const hoveredCityId = ref(null)
const pinnedCityId = ref(null)

function positionFor(cityId) {
  return CITY_POSITIONS[cityId] ?? DEFAULT_POSITION
}

function togglePin(cityId) {
  pinnedCityId.value = pinnedCityId.value === cityId ? null : cityId
}
</script>

<template>
  <div class="korea-map" @click="pinnedCityId = null">
    <div class="map-outline" v-html="koreaMapSvg"></div>

    <div
      v-for="weather in weatherList"
      :key="weather.id"
      class="city-marker"
      :class="{ 'is-active': hoveredCityId === weather.id || pinnedCityId === weather.id }"
      :style="{ top: positionFor(weather.id).top + '%', left: positionFor(weather.id).left + '%' }"
      @mouseenter="hoveredCityId = weather.id"
      @mouseleave="hoveredCityId = null"
      @click.stop="togglePin(weather.id)"
    >
      <span class="city-label">{{ weather.name }}</span>

      <ul
        v-if="hoveredCityId === weather.id || pinnedCityId === weather.id"
        class="city-popup"
        @click.stop
      >
        <WeatherCard
          :weather="weather"
          @select-card="$emit('select-card', $event)"
          @click-detail="$emit('click-detail', $event)"
        />
      </ul>
    </div>
  </div>
</template>

<style scoped>
.korea-map {
  position: relative;
  width: 100%;
  max-width: 420px;
  aspect-ratio: 800 / 1200;
  margin: 0 auto;
}

.map-outline {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.map-outline :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

.map-outline :deep(polyline),
.map-outline :deep(path) {
  fill: #e2e8f0;
  stroke: #ffffff;
  stroke-width: 1.2;
  stroke-linejoin: round;
}

.city-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 1;
}

/* transform이 각 마커마다 별도 stacking context를 만들기 때문에,
   호버된 마커의 z-index를 직접 끌어올려야 카드가 다른 마커 위로 확실히 옵니다. */
.city-marker.is-active {
  z-index: 50;
}

.city-label {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e3a5f;
  white-space: nowrap;
  transition: color 0.15s;
}

.city-marker:hover .city-label {
  color: #0284c7;
}

.city-popup {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
