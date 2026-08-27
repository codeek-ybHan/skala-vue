<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/configStore'

const HOT_THRESHOLD_C = 25
const COLD_THRESHOLD_C = 10

const configStore = useConfigStore()
const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['select-card', 'click-detail'])

function handleDetailClick() {
  emit('click-detail', props.weather.id)
}

const displayTemp = computed(() => configStore.convertTemp(props.weather.temp))
const displayFeelsLike = computed(() => configStore.convertTemp(props.weather.feelsLike))
const hotThreshold = computed(() => configStore.convertTemp(HOT_THRESHOLD_C))
const coldThreshold = computed(() => configStore.convertTemp(COLD_THRESHOLD_C))
const badgeType = computed(() => {
  if (displayTemp.value >= hotThreshold.value) return 'hot'
  if (displayTemp.value <= coldThreshold.value) return 'cold'
  return 'normal'
})
</script>

<template>
  <li class="city-card" @click="emit('select-card', weather.name)">
    <div class="city-card-header">
      <p class="city-name">{{ weather.name }}</p>
      <span class="city-status">{{ weather.status }}</span>
    </div>

    <p class="city-temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
    <span class="badge" :class="`badge-${badgeType}`">
      <template v-if="badgeType === 'hot'">🔥 더움 ({{ hotThreshold }}{{ configStore.unitSymbol }} 이상)</template>
      <template v-else-if="badgeType === 'cold'">❄️ 추움 ({{ coldThreshold }}{{ configStore.unitSymbol }} 이하)</template>
      <template v-else>🌤️ 적정 ({{ coldThreshold }}{{ configStore.unitSymbol }} ~ {{ hotThreshold }}{{ configStore.unitSymbol }})</template>
    </span>

    <dl class="city-meta">
      <div class="city-meta-row">
        <dt>바람</dt>
        <dd>{{ weather.wind }}</dd>
      </div>
      <div class="city-meta-row">
        <dt>체감 온도</dt>
        <dd>{{ displayFeelsLike }}{{ configStore.unitSymbol }}</dd>
      </div>
    </dl>

    <button type="button" class="detail-btn" @click.stop="handleDetailClick">
      상세보기
    </button>
  </li>
</template>

<style scoped>
.city-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.city-card:hover {
  border-color: #7dd3fc;
  box-shadow: 0 12px 24px -12px rgba(14, 165, 233, 0.3);
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
  color: #334155;
  background: #f8fafc;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

.city-temp {
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #0f172a, #0284c7);
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
  border-top: 1px dashed #cbd5e1;
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
  background: #f2f3f5;
  color: #0369a1;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}

.detail-btn:hover {
  background: #bae6fd;
}

.detail-btn:active {
  transform: scale(0.98);
}
</style>
