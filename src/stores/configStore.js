import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius') // state: 단위 저장 (초기값 'celsius')
 
  // getters: 현재 단위 상태에 맞춰 화면에 뿌릴 기호(℃ / ℉)를 실시간 리턴
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  // actions: 버튼 클릭 시 'celsius'와 'fahrenheit'를 토글(스위칭)하는 함수
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  // 섭씨 값을 현재 단위(unit)에 맞게 변환
  function convertTemp(celsius) {
    if (unit.value === 'fahrenheit') return Math.round((celsius * 9) / 5 + 32)
    return celsius
  }

  return {
    unit,
    unitSymbol,
    toggleUnit,
    convertTemp,
  }
})
