<script setup>
import BaseDashboardCard from '../components/BaseDashboardCard.vue' // 섹션 스타일 재사용

const features = [
  { icon: '🔍', title: '도시 검색', desc: '원하는 도시를 검색해 실시간 날씨를 빠르게 확인할 수 있어요.' },
  { icon: '🏙️', title: '지역별 현황', desc: '주요 도시의 기온, 날씨 상태, 체감 온도를 한눈에 비교해 보세요.' },
  { icon: '💬', title: '상태 메시지', desc: '선택한 도시에 맞춰 오늘의 분위기를 안내해 드려요.' },
]
</script>

<template>
  <div class="about">
    <h1>☁️ SKALA 날씨 대시보드 소개</h1>

    <BaseDashboardCard>
      <template #header><span class="icon">📖</span> 서비스 소개</template>
      <p class="lead">
        SKALA 날씨 대시보드는 여러 도시의 날씨를 한 화면에서 빠르게 확인할 수 있는 서비스입니다.
        검색으로 원하는 도시를 찾고, 카드 형태로 정리된 정보를 통해 오늘의 날씨를 한눈에 파악해 보세요.
      </p>
    </BaseDashboardCard>

    <BaseDashboardCard>
      <template #header><span class="icon">✨</span> 주요 기능</template>
      <ul class="feature-list">
        <li v-for="feature in features" :key="feature.title" class="feature-item">
          <span class="feature-icon">{{ feature.icon }}</span>
          <div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </div>
        </li>
      </ul>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.about > h1 {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1e3a5f;
}

.icon {
  font-size: 1.1rem;
}

.lead {
  margin: 0;
  line-height: 1.6;
  color: #334155;
}

.feature-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.1rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
}

.feature-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.feature-item h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  color: #0f172a;
}

.feature-item p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
}

.footer-text {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}
</style>
