<script setup>
import { ref } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', mood: '산책하기 좋은 날', wind: '3m/s', feelsLike: 30 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', mood: '집콕하기 좋은 날', wind: '5m/s', feelsLike: 23 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', mood: '느긋하게 보내기 좋은 날', wind: '4m/s', feelsLike: 27 },
])

const city = ref('')
</script>

<template>
  <div class="weather">
    <h1>🌤️ 과제 1: 날씨 (Mockup)</h1>

    <section class="panel">
      <h2><span class="icon">🔍</span> 도시 검색</h2>
      <input type="text" :value="city" @input="(e) => (city = e.target.value)" class="search-input" placeholder="검색할 도시 이름 입력"/>
      <p class="search-status">
        검색 중인 도시: {{ city }}
      </p>
    </section>
  </div>
</template>