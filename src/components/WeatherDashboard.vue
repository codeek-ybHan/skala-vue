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

    <section class="panel">
      <h2><span class="icon">🏙️</span> 지역별 날씨 현황</h2>
      
      <ul class="city-list">
        <li v-for="weather in weatherList" :key="weather.id" class="city-item">
          <div class="city-main"> 
            <p class="city-name"> {{ weather.name }} ({{ weather.status }})</p>
            <p class="city-temp">현재 기온: {{ weather.temp }}°C</p>

            <span class="badge" v-if="weather.temp >= 25">🔥 더움 (25도 이상)</span>
            <span class="badge" v-else-if="weather.temp <= 10">❄️ 추움 (10도 이하)</span>
            <span class="badge" v-else>🌤️ 적정 (10도 ~ 25도)</span>

            <p>바람: {{ weather.wind }}</p>
            <p>체감 온도: {{ weather.feelsLike }}°C</p>
            <p>기분: {{ weather.mood }}</p>
          </div>

          <button type="button" class="detail-btn" @click.stop="toggleCity(weather.id)">
            상세보기
          </button>
        </li>
      </ul>
    </section>

  </div>
</template>