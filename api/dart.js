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

  const url = new URL('https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json')
  url.searchParams.set('crtfc_key', key)
  url.searchParams.set('corp_code', corp_code)
  url.searchParams.set('bsns_year', bsns_year)
  url.searchParams.set('reprt_code', reprt_code)
  url.searchParams.set('fs_div', fs_div)

  try {
    const upstream = await fetch(url)
    const data = await upstream.json()
    // DART 응답 캐시 (같은 연도 공시는 자주 안 바뀜)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    res.status(200).json(data)
  } catch (error) {
    console.error('DART 프록시 요청 실패:', error)
    res.status(502).json({ status: 'error', message: 'DART 요청에 실패했습니다.' })
  }
}
