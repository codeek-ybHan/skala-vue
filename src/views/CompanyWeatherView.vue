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
}
</style>
