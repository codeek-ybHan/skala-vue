// Vercel 서버리스 함수 — 브라우저의 /api/dart 요청을 OpenDART로 대신 전달한다.
// Vercel의 vercel.json rewrites(엣지 프록시)는 opendart.fss.or.kr와 TLS 핸드셰이크가
// 실패(ROUTER_EXTERNAL_TARGET_HANDSHAKE_ERROR)하므로, Node 런타임에서 fetch로 우회한다.
// API 키(crtfc_key)는 여기서만 붙이므로 프런트 번들에 노출되지 않는다.
export default async function handler(req, res) {
  const key = process.env.DART_API_KEY
  if (!key) {
    res.status(500).json({ status: 'error', message: 'DART_API_KEY 환경변수가 설정되지 않았습니다.' })
    return
  }

  const { corp_code, bsns_year, reprt_code = '11011', fs_div = 'CFS' } = req.query
  if (!corp_code || !bsns_year) {
    res.status(400).json({ status: 'error', message: 'corp_code, bsns_year는 필수입니다.' })
    return
  }

  // fnlttSinglAcntAll(전체 재무제표, ~100KB) 대신 fnlttSinglAcnt(주요계정, ~16KB)만 받아 응답 속도를 높인다.
  // 필요한 값(매출액/영업이익/당기순이익/부채총계)은 주요계정에 모두 포함된다.
  const url = new URL('https://opendart.fss.or.kr/api/fnlttSinglAcnt.json')
  url.searchParams.set('crtfc_key', key)
  url.searchParams.set('corp_code', corp_code)
  url.searchParams.set('bsns_year', bsns_year)
  url.searchParams.set('reprt_code', reprt_code)
  url.searchParams.set('fs_div', fs_div)

  try {
    const upstream = await fetch(url)
    const data = await upstream.json()
    // 지난 사업연도 공시는 거의 안 바뀌므로 CDN에 하루 캐시 (콜드 스타트 회피)
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800')
    res.status(200).json(data)
  } catch (error) {
    console.error('DART 프록시 요청 실패:', error)
    res.status(502).json({ status: 'error', message: 'DART 요청에 실패했습니다.' })
  }
}
