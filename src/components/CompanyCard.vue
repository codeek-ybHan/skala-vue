<script setup>
import { computed } from 'vue'

const props = defineProps({
  company: {
    type: Object,
    required: true,
  },
})

const STATUS_EMOJI = {
  맑음: '☀️',
  구름: '☁️',
  비: '🌧️',
  폭풍: '⛈️',
  흐림: '😐',
}

const statusEmoji = computed(() => STATUS_EMOJI[props.company.status] ?? '❓')

function formatMoney(amountWon) {
  if (amountWon == null) return '-'
  const trillion = amountWon / 1_000_000_000_000
  if (Math.abs(trillion) >= 1) return `${trillion.toFixed(1)}조`
  const hundredMillion = amountWon / 100_000_000
  return `${hundredMillion.toFixed(0)}억`
}

function trendArrow(current, previous) {
  if (current == null || previous == null) return ''
  if (current > previous) return '↑'
  if (current < previous) return '↓'
  return '－'
}

const rows = computed(() => [
  { label: '매출액', current: props.company.revenue, prev: props.company.prevRevenue },
  { label: '영업이익', current: props.company.operatingProfit, prev: props.company.prevOperatingProfit },
  { label: '당기순이익', current: props.company.netIncome, prev: props.company.prevNetIncome },
  { label: '부채총계', current: props.company.debt, prev: props.company.prevDebt },
])
</script>

<template>
  <div class="company-card">
    <p class="company-name">{{ company.companyName }}</p>
    <p class="company-status">{{ statusEmoji }} {{ company.status }}</p>

    <dl class="company-meta">
      <div v-for="row in rows" :key="row.label" class="company-meta-row">
        <dt>{{ row.label }}</dt>
        <dd>
          {{ formatMoney(row.current) }}
          <span
            class="trend"
            :class="{ up: row.current > row.prev, down: row.current < row.prev }"
          >{{ trendArrow(row.current, row.prev) }}</span>
        </dd>
      </div>
    </dl>

    <p class="disclaimer">* DART 공시 재무정보를 단순 비교한 참고용 표시입니다.</p>
  </div>
</template>

<style scoped>
.company-card {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 1.25rem;
  max-width: 320px;
}

.company-name {
  margin: 0;
  font-weight: 700;
  font-size: 1.1rem;
  color: #0f172a;
}

.company-status {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  color: #1e3a5f;
}

.company-meta {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin: 0.3rem 0 0;
  padding-top: 0.7rem;
  border-top: 1px dashed #cbd5e1;
  font-size: 0.9rem;
  color: #475569;
}

.company-meta-row {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.company-meta-row dt {
  color: #94a3b8;
}

.company-meta-row dd {
  margin: 0;
  font-weight: 600;
  color: #0f172a;
}

.trend {
  margin-left: 0.15rem;
  font-weight: 700;
}

.trend.up {
  color: #b91c1c;
}

.trend.down {
  color: #1d4ed8;
}

.disclaimer {
  margin: 0.3rem 0 0;
  font-size: 0.72rem;
  color: #94a3b8;
}
</style>
