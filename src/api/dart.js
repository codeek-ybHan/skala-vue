import axios from 'axios'

// DART는 CORS를 허용하지 않고 API 키도 노출하면 안 되므로, 서버 프록시를 경유한다.
// crtfc_key는 프록시 쪽(process.env.DART_API_KEY)에서 붙는다.
// - 개발: vite.config.js의 dev 서버 프록시
// - 배포(Vercel): api/dart.js 서버리스 함수
const BASE_URL = '/api/dart'

// 주요계정 API(fnlttSinglAcnt)는 account_id가 없어 account_nm으로 매칭한다.
// 연결(CFS)/개별(OFS)이 함께 내려오므로 fs_div === 'CFS'만 사용.
const IS_DIVS = ['IS', 'CIS']

function findByName(list, matcher, sjDivs) {
  return list.find(
    (item) => item.fs_div === 'CFS' && sjDivs.includes(item.sj_div) && matcher(item.account_nm ?? ''),
  )
}

function toNumber(value) {
  if (value === undefined || value === null || value === '') return null
  // 주요계정 API는 금액을 "227,062,266,000,000"처럼 콤마 포함 문자열로 준다
  const n = Number(String(value).replace(/,/g, ''))
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
  const revenueItem = findByName(list, (nm) => nm === '매출액' || nm === '영업수익', IS_DIVS)
  const profitItem = findByName(list, (nm) => nm === '영업이익' || nm === '영업손실', IS_DIVS)
  const netIncomeItem = findByName(list, (nm) => nm.startsWith('당기순이익'), IS_DIVS)
  const debtItem = findByName(list, (nm) => nm === '부채총계', ['BS'])

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
