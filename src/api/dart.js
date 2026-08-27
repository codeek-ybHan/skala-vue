import axios from 'axios'

const API_KEY = import.meta.env.VITE_DART_API_KEY
// DART가 CORS를 허용하지 않아 vite.config.js의 개발 서버 프록시(/dart-api)를 경유함
const BASE_URL = '/dart-api/fnlttSinglAcntAll.json'

// 계정과목 표기는 기업마다 다르지만(매출액/영업수익 등), account_id(IFRS 표준 계정 ID)는 공통이라 이걸로 매칭
const ACCOUNT_ID = {
  revenue: 'ifrs-full_Revenue',
  operatingProfit: 'dart_OperatingIncomeLoss',
  netIncome: 'ifrs-full_ProfitLoss',
  debt: 'ifrs-full_Liabilities',
}

function findAccount(list, accountId, sjDivs) {
  return list.find((item) => item.account_id === accountId && sjDivs.includes(item.sj_div))
}

function toNumber(value) {
  if (value === undefined || value === null || value === '') return null
  const n = Number(value)
  return Number.isNaN(n) ? null : n
}

// 우선순위: 폭풍(악화 심함) → 그 외 단순 증감 비교
function decideStatus({ revenue, prevRevenue, operatingProfit, prevOperatingProfit, debt, prevDebt }) {
  const revenueUp = revenue > prevRevenue
  const revenueDown = revenue < prevRevenue
  const profitUp = operatingProfit > prevOperatingProfit
  const profitDown = operatingProfit < prevOperatingProfit
  const debtUp = debt > prevDebt

  if (revenueDown && profitDown && debtUp) return '폭풍'
  if (revenueDown && profitDown) return '비'
  if (revenueUp && profitUp) return '맑음'
  if (revenueUp || profitUp) return '구름'
  return '흐림'
}

export async function fetchCompanyFinance({ name, corpCode }) {
  const bsnsYear = String(new Date().getFullYear() - 1)

  const res = await axios.get(BASE_URL, {
    params: {
      crtfc_key: API_KEY,
      corp_code: corpCode,
      bsns_year: bsnsYear,
      reprt_code: '11011', // 사업보고서(연간)
      fs_div: 'CFS', // 연결재무제표
    },
  })

  if (res.data.status !== '000') {
    throw new Error(res.data.message || 'DART 재무정보를 불러오지 못했습니다.')
  }

  const list = res.data.list ?? []
  const revenueItem = findAccount(list, ACCOUNT_ID.revenue, ['IS', 'CIS'])
  const profitItem = findAccount(list, ACCOUNT_ID.operatingProfit, ['IS', 'CIS'])
  const netIncomeItem = findAccount(list, ACCOUNT_ID.netIncome, ['IS', 'CIS'])
  const debtItem = findAccount(list, ACCOUNT_ID.debt, ['BS'])

  const revenue = toNumber(revenueItem?.thstrm_amount)
  const prevRevenue = toNumber(revenueItem?.frmtrm_amount)
  const operatingProfit = toNumber(profitItem?.thstrm_amount)
  const prevOperatingProfit = toNumber(profitItem?.frmtrm_amount)
  const netIncome = toNumber(netIncomeItem?.thstrm_amount)
  const prevNetIncome = toNumber(netIncomeItem?.frmtrm_amount)
  const debt = toNumber(debtItem?.thstrm_amount)
  const prevDebt = toNumber(debtItem?.frmtrm_amount)

  return {
    companyName: name,
    bsnsYear,
    status: decideStatus({ revenue, prevRevenue, operatingProfit, prevOperatingProfit, debt, prevDebt }),
    revenue,
    prevRevenue,
    operatingProfit,
    prevOperatingProfit,
    netIncome,
    prevNetIncome,
    debt,
    prevDebt,
  }
}
