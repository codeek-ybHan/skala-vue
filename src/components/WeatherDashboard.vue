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
        <li v-for="weather in weatherList" :key="weather.id" class="city-card">
          <div class="city-card-header">
            <p class="city-name">{{ weather.name }}</p>
            <span class="city-status">{{ weather.status }}</span>
          </div>

          <p class="city-temp">{{ weather.temp }}°C</p>

          <span
            class="badge"
            :class="weather.temp >= 25 ? 'badge-hot' : weather.temp <= 10 ? 'badge-cold' : 'badge-normal'"
          >
            <template v-if="weather.temp >= 25">🔥 더움 (25도 이상)</template>
            <template v-else-if="weather.temp <= 10">❄️ 추움 (10도 이하)</template>
            <template v-else>🌤️ 적정 (10도 ~ 25도)</template>
          </span>

          <dl class="city-meta">
            <div class="city-meta-row">
              <dt>바람</dt>
              <dd>{{ weather.wind }}</dd>
            </div>
            <div class="city-meta-row">
              <dt>체감 온도</dt>
              <dd>{{ weather.feelsLike }}°C</dd>
            </div>
            <div class="city-meta-row">
              <dt>기분</dt>
              <dd>{{ weather.mood }}</dd>
            </div>
          </dl>

          <button type="button" class="detail-btn" @click.stop="toggleCity(weather.id)">
            상세보기
          </button>
        </li>
      </ul>
    </section>

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
  color: #0f172a;
}

.panel {
  background: #ffffff;
  border: 1px solid #e8edf3;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.08);
}

h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eef2f7;
}

.icon {
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  box-sizing: border-box;
  background: #f8fafc;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}

.search-input::placeholder {
  color: #a3aebc;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
}

.search-status {
  margin: 0.75rem 0 0;
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

.city-card {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.city-card:hover {
  border-color: #c7d2fe;
  box-shadow: 0 12px 24px -12px rgba(79, 70, 229, 0.2);
  transform: translateY(-3px);
}

.city-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.city-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: #0f172a;
}

.city-status {
  font-size: 0.78rem;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

.city-temp {
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #0f172a, #4338ca);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1;
}

.badge {
  display: inline-flex;
  align-self: flex-start;
  font-size: 0.78rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-weight: 600;
}

.badge-hot {
  background: #fee2e2;
  color: #b91c1c;
}

.badge-cold {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-normal {
  background: #dcfce7;
  color: #15803d;
}

.city-meta {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin: 0.3rem 0 0;
  padding-top: 0.7rem;
  border-top: 1px dashed #e8edf3;
  font-size: 0.85rem;
  color: #475569;
}

.city-meta-row {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.city-meta-row dt {
  color: #94a3b8;
}

.city-meta-row dd {
  margin: 0;
  font-weight: 500;
  text-align: right;
}

.detail-btn {
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: none;
  border-radius: 10px;
  background: #eef1ff;
  color: #4338ca;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}

.detail-btn:hover {
  background: #e0e4ff;
}

.detail-btn:active {
  transform: scale(0.98);
}
</style>