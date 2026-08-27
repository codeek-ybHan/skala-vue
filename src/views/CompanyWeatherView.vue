<script setup>
import { ref, computed } from 'vue'
import { DART_COMPANIES } from '../data/dartCompanies'
import { fetchCompanyFinance } from '../api/dart'
import BaseDashboardCard from '../components/BaseDashboardCard.vue'
import CompanyCard from '../components/CompanyCard.vue'

const selectedCompanyId = ref(null)
const companyFinance = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const selectedCompanyName = computed(() => {
  const found = DART_COMPANIES.find((company) => company.id === selectedCompanyId.value)
  return found?.name ?? ''
})

// api/dart.js의 decideStatus() 판정 규칙과 동일 (직전 사업연도 vs 그 전년도 비교)
const STATUS_CRITERIA = [
  { emoji: '⛈️', label: '폭풍', desc: '매출·영업이익이 모두 감소하고 부채총계까지 증가' },
  { emoji: '🌧️', label: '비', desc: '매출·영업이익이 모두 감소' },
  { emoji: '☀️', label: '맑음', desc: '매출·영업이익이 모두 증가' },
  { emoji: '☁️', label: '구름', desc: '매출·영업이익 중 하나만 증가' },
  { emoji: '😐', label: '흐림', desc: '그 외 (뚜렷한 개선 신호가 없음)' },
]

async function selectCompany(company) {
  selectedCompanyId.value = company.id
  companyFinance.value = null
  errorMessage.value = ''
  isLoading.value = true
  try {
    companyFinance.value = await fetchCompanyFinance(company)
  } catch (error) {
    console.error('🔴 DART 재무정보 연동 실패:', error)
    errorMessage.value = '재무정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="company-weather">
    <h1>📊 기업 날씨</h1>

    <BaseDashboardCard>
      <template #header><span class="icon">🏢</span> 기업 선택</template>
      <ul class="company-list">
        <li v-for="company in DART_COMPANIES" :key="company.id">
          <button
            type="button"
            class="company-btn"
            :class="{ active: selectedCompanyId === company.id }"
            @click="selectCompany(company)"
          >
            {{ company.name }}
          </button>
        </li>
      </ul>
    </BaseDashboardCard>

    <BaseDashboardCard>
      <template #header><span class="icon">🌦️</span> 기업 날씨</template>
      <p v-if="isLoading" class="status-text">{{ selectedCompanyName }} 재무정보를 불러오는 중...</p>
      <p v-else-if="errorMessage" class="status-text">{{ errorMessage }}</p>
      <CompanyCard v-else-if="companyFinance" :company="companyFinance" />
      <p v-else class="status-text">기업을 선택하면 최근 재무 흐름을 날씨로 보여드려요.</p>
    </BaseDashboardCard>

    <BaseDashboardCard>
      <template #header><span class="icon">📖</span> 날씨 상태 판단 기준</template>
      <p class="status-text">
        직전 사업연도(연결재무제표 기준)와 그 전년도의 <strong>매출액·영업이익·부채총계</strong>를 비교해
        아래 순서대로 하나의 상태로 판정합니다.
      </p>
      <ul class="criteria-list">
        <li v-for="item in STATUS_CRITERIA" :key="item.label" class="criteria-item">
          <span class="criteria-emoji">{{ item.emoji }}</span>
          <span class="criteria-label">{{ item.label }}</span>
          <span class="criteria-desc">{{ item.desc }}</span>
        </li>
      </ul>
      <p class="criteria-note">* OpenDART 공시 수치를 단순 증감 비교한 참고용 지표이며, 공시가 갱신되면 상태도 바뀔 수 있습니다.</p>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.company-weather {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.company-weather > h1 {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1e3a5f;
}

.icon {
  font-size: 1.1rem;
}

.company-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.company-btn {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.company-btn:hover {
  background: #e2e8f0;
}

.company-btn.active {
  background: #1e3a5f;
  border-color: #1e3a5f;
  color: #ffffff;
}

.status-text {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
}

.criteria-list {
  list-style: none;
  margin: 0.9rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.criteria-item {
  display: grid;
  grid-template-columns: 1.6rem 3rem 1fr;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #475569;
}

.criteria-emoji {
  font-size: 1.1rem;
  line-height: 1;
}

.criteria-label {
  font-weight: 700;
  color: #1e3a5f;
}

.criteria-desc {
  color: #64748b;
}

.criteria-note {
  margin: 0.9rem 0 0;
  font-size: 0.75rem;
  color: #94a3b8;
}
</style>
