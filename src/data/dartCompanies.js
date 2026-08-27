// DART(OpenDART)는 기업명이 아닌 8자리 고유 corp_code로 기업을 조회하므로, corp_code 매핑을 직접 들고 있어야 한다.
export const DART_COMPANIES = [
  { id: 'corp_01', name: '삼성전자', corpCode: '00126380' },
  { id: 'corp_02', name: 'SK하이닉스', corpCode: '00164779' },
  { id: 'corp_03', name: 'LG전자', corpCode: '00401731' },
  { id: 'corp_04', name: '현대자동차', corpCode: '00164742' },
  { id: 'corp_05', name: 'NAVER', corpCode: '00266961' },
  // 아래는 최근(직전 사업연도) 실적이 부진한 기업들. bsns_year는 매년 자동으로 최신 연도로 바뀌므로, 아래 기업들의 상태(폭풍/비 등)는 실제 공시가 갱신되면서 계속 바뀔 수 있음 — mock이 아니라 실시간 API 결과라 그렇다.
  { id: 'corp_06', name: '노루페인트', corpCode: '00583442' },
  { id: 'corp_07', name: 'LG생활건강', corpCode: '00356370' },
  { id: 'corp_08', name: '롯데케미칼', corpCode: '00165413' },
  { id: 'corp_09', name: '삼표시멘트', corpCode: '00239639' },
  { id: 'corp_10', name: '태광산업', corpCode: '00153393' },
]
