# DART Weather

여러 도시의 실시간 날씨를 지도·카드로 확인하고, OpenDART 공시 재무정보로 기업의 최근 실적 흐름까지 "날씨"로 보여주는 대시보드입니다. (SKALA Vue 실습 프로젝트)

**배포:** https://skala-vue-dart-weather.vercel.app

> 실습은 각 step의 요구사항을 먼저 이해하고 구현한 뒤, 저의 차별점인 **"기업 재무지표를 날씨로 반환하는 기능"** 관련 코드는 따로 구성해뒀다가 마지막에 얹는 방식으로 진행했습니다. 단계별 진행 내용은 git commit message와 아래 [학습 진행 기록](#학습-진행-기록)에 자세히 남겨뒀습니다.

---

## 실습 중 고려한 사항 정리

지역별 날씨 현황을 지도와 카드 두 가지 방식으로 볼 수 있도록 구성했습니다.
지도에 이벤트 디렉티브 `@mouseenter`와 `@mouseleave`를 활용해 마우스가 올라간 도시를 `hoveredCityId`로 관리했습니다.

날씨 정보에서는 현재 기온뿐만 아니라 체감 온도도 함께 표시했습니다.
이에 따라 섭씨와 화씨를 전환할 때 현재 기온만 변경되는 것이 아니라 체감 온도와 더움/추움 판단 기준까지 함께 변경되도록 온도 변환 로직을 공통으로 관리했습니다.

기업 재무 날씨 기능에서는 재무제표 수치를 그대로 나열하는 대신, 당기와 전기를 비교한 증감 방향만 뽑아 "맑음/구름/비/폭풍" 같은 날씨 상태로 치환해 한눈에 읽히도록 했습니다.
계정과목 명칭이 기업마다 달라 매칭이 깨지는 문제는 IFRS 표준 계정 ID로 조회하는 방식으로 해결했습니다.
DART가 CORS를 허용하지 않는 점은 개발에서는 dev 서버 프록시로, 배포(Vercel)에서는 서버리스 함수로 우회했고, 이 과정에서 API 키도 프런트 번들에서 완전히 걷어내 서버 환경변수(`DART_API_KEY`)로만 다루도록 정리했습니다.

## 주요 기능

**도시 날씨**
- 도시 검색 및 실시간 필터링
- 지도 / 카드 두 가지 보기 모드로 지역별 날씨 확인
- 도시 상세 페이지에서 기온·체감 온도·바람 정보 확인
- 섭씨 ↔ 화씨 단위 전환 (체감 온도, 더움/추움 판단 기준까지 함께 환산)
- OpenWeatherMap API 실시간 연동

**기업 재무 날씨 (차별점)**
- OpenDART 재무제표를 조회해 매출액·영업이익·당기순이익·부채총계의 전기 대비 증감을 날씨 상태로 표시
- 상태 이모지 / 조·억 단위 금액 / 증감 화살표로 구성한 기업 날씨 카드

## 프로젝트 구조

```
api/            # Vercel 서버리스 함수
└─ dart.js      #   DART 프록시 (API 키 주입 + CORS 우회)
src/
├─ api/         # 외부 API 호출 클라이언트 (weather.js, dart.js)
├─ assets/      # 전역 스타일, 정적 자산(지도 SVG 등)
├─ components/  # 재사용 UI 컴포넌트
├─ data/        # 정적 참조 데이터 (도시 목록, DART corp_code 매핑)
├─ router/      # 라우터 설정
├─ stores/      # Pinia 스토어
└─ views/       # 라우트 단위 페이지 컴포넌트
```

### 환경변수

| 이름 | 용도 | 노출 범위 |
|---|---|---|
| `VITE_WEATHER_API_KEY` | OpenWeatherMap 날씨 API 키 | 브라우저 번들에 포함 (OWM은 CORS 허용이라 클라이언트에서 직접 호출) |
| `DART_API_KEY` | OpenDART 재무 API 키 | 서버(프록시)에서만 사용 — 프런트 번들에 포함되지 않음 |

---

## 차별점: 기업 재무 날씨 (DART API)

도시 날씨 대시보드와 별개로, **기업의 최근 재무 흐름을 날씨로 반환하는 기능**을 추가로 구현했습니다.

### 날씨 상태 판정 기준

직전 사업연도와 그 전년도의 **매출액·영업이익·부채총계**를 비교해, 아래 순서대로 하나의 상태로 판정합니다 (`api/dart.js`의 `decideStatus`).

| 상태 | 조건 |
|---|---|
| ⛈️ 폭풍 | 매출·영업이익 모두 감소 **+** 부채총계 증가 |
| 🌧️ 비 | 매출·영업이익 모두 감소 |
| ☀️ 맑음 | 매출·영업이익 모두 증가 |
| ☁️ 구름 | 매출·영업이익 중 하나만 증가 |
| 😐 흐림 | 그 외 |

### 동작 방식

- `/company` 라우트(`views/CompanyWeatherView.vue`) + `App.vue` 네비게이션 "기업 날씨" 탭
- DART는 기업명이 아닌 8자리 `corp_code`로만 조회 가능 → `data/dartCompanies.js`에 기업명 ↔ `corp_code` 매핑을 직접 보유
- 기업 선택 시 `api/dart.js`의 `fetchCompanyFinance()`가 OpenDART **주요계정 API**(`fnlttSinglAcnt.json`)를 호출 (직전 사업연도, 사업보고서 `11011`, 연결재무제표 `CFS`)
  - 전체 재무제표(`...AcntAll`, ~100KB) 대신 주요계정(~16KB)만 받아 응답을 가볍게 함
- 주요계정 응답에는 `account_id`가 없어 `account_nm`(매출액/영업이익/당기순이익/부채총계) + `fs_div === 'CFS'`로 매칭, 금액은 콤마 제거 후 숫자로 변환
- `components/CompanyCard.vue`에서 상태 이모지, 조/억 단위 금액 포맷, 전기 대비 증감 화살표(↑/↓)로 표시
- 실시간 API 결과라, 공시가 갱신되면 기업별 상태 표시도 바뀔 수 있음

### DART 프록시

DART는 CORS를 허용하지 않고 API 키도 노출하면 안 되므로, 브라우저는 항상 서버 프록시(`/api/dart`)를 경유한다.

- **개발**: `vite.config.js`의 dev 서버 프록시 (`.env`의 `DART_API_KEY` 주입)
- **배포(Vercel)**: `api/dart.js` 서버리스 함수 (`process.env.DART_API_KEY` 주입)
  - `vercel.json`의 `rewrites`로 `opendart.fss.or.kr`에 직접 프록시하면 TLS 핸드셰이크 실패(`ROUTER_EXTERNAL_TARGET_HANDSHAKE_ERROR`, 502)가 나서 함수 방식으로 우회

## 배포 (Vercel)

- 정적 빌드(`npm run build` → `dist/`)와 `api/` 서버리스 함수가 함께 배포된다.
- **환경변수**: Vercel 프로젝트 → Settings → Environment Variables 에 `VITE_WEATHER_API_KEY`, `DART_API_KEY` 등록 후 재배포.
  - `VITE_*` 변수는 브라우저에 노출되므로 Secret 타입으로 저장할 수 없다 → **Config 타입**으로 등록.
  - `DART_API_KEY`는 `VITE_` 접두사가 없어 Secret 타입으로 저장 가능(진짜 비공개).
- **SPA 라우팅**: `vercel.json`에서 `/api`를 제외한 모든 경로를 `/index.html`로 rewrite (직접 접속·새로고침 시 404 방지).
- **재무 조회 응답 속도** — 초기엔 함수가 미국 리전(`iad1`)에서 실행돼 첫 요청이 8초까지 걸렸다. 개선:
  - `vercel.json`의 `"regions": ["icn1"]`로 함수를 **서울 리전**에서 실행 (DART·사용자와 같은 지역)
  - 주요계정 API로 교체해 페이로드 축소(~100KB → ~16KB)
  - 함수 응답에 `Cache-Control: s-maxage=86400` → 같은 기업 재조회는 CDN 엣지 캐시에서 즉시 응답

---

## 학습 진행 기록

### Step1: Weather Mockup
- 정적 Mock 데이터(서울/수원/부산 3개 도시)로 날씨 대시보드 화면 뼈대 구성
- 도시별 날씨 카드 UI 구현: 도시명, 실시간 기온, 날씨 상태, 더움/추움/적정 배지
- 카드 클릭 시 선택 상태를 표시하는 하단 상태바(status banner) 구현
- 전체 레이아웃/카드 스타일(그림자, 라운드 처리 등) 다듬기
- 사용한 디렉티브: `v-if` / `v-else`(조건부 렌더링), `v-for`(도시 목록 반복 렌더링), `v-bind`(`:`, 클래스/속성 바인딩), `v-on`(`@`, 이벤트 바인딩)
- `v-on` 이벤트와 modifier 활용: `@click.stop`으로 이벤트 버블링 차단, `@keydown.enter`처럼 특정 키에만 반응하는 modifier 사용
- `hoveredCityId` ref로 현재 마우스가 올라가 있는 카드(도시)의 id를 추적해서, 여러 카드 중 어떤 카드에 마우스가 있는지 하나의 상태로 구분
- 검색창은 `v-model` 대신 단방향 바인딩(`:value`) + 이벤트(`@input`) 조합으로 구현 — 한글(IME 조합) 입력이 끊기지 않고 바로 반영되도록 하기 위함

### Step2: Weather Composition
- 반응형 상태 변수(`ref`)로 화면에 필요한 값을 각각 관리
  - `searchQuery`: 검색어 입력값
  - `statusMessage`: 하단 상태바에 표시할 문구
  - `selectedCityInfo`: 현재 선택된 도시명
  - `weatherList` / `isLoading`: API로 불러온 날씨 목록과 로딩 여부
  - `viewMode`: 지도 / 카드 보기 모드 전환 상태
  - `isPanelHovered`: 마우스가 "지역별 날씨 현황" 패널 위에 있는지 여부(Enter 키 단축키 조건으로 활용)
- `computed`로 `filteredWeatherList` 구현 — `searchQuery`가 바뀔 때마다 검색어에 해당하는 도시만 자동으로 다시 걸러서 보여줌
- `watch(searchQuery, ...)`로 검색어가 바뀔 때마다 URL 쿼리 스트링(`?search=`)에 반영해 라우터 상태와 동기화 (새로고침해도 검색어 유지)
- `watch(selectedCityInfo, ...)`로 선택된 도시가 바뀔 때마다 상태바 문구를 자동으로 갱신(선택 해제 시 기본 문구로 복귀)하고 콘솔에 로그 출력
- `watchEffect()`로 검색어 입력을 실시간으로 감지해 로그 출력 — 의존성을 자동으로 추적하는 `watchEffect`와, 감시 대상을 직접 지정하는 `watch`의 차이를 비교하며 학습
- (참고) 카드에 마우스를 올렸을 때 반응하던 `@mouseenter` / `@mouseleave` 인터랙션은 이후 지도 컴포넌트의 `hoveredCityId`(호버된 마커 추적) / `isPanelHovered`(단축키 조건) 상태로 발전됨
- `@mouseenter` / `@mouseleave` 실제 사용 위치
  - `KoreaMap.vue`의 도시 마커: `@mouseenter="hoveredCityId = weather.id"` / `@mouseleave="hoveredCityId = null"` — 마우스가 올라간 도시의 id를 `hoveredCityId`에 저장해서, 해당 도시의 날씨 카드만 지도 위에 팝업으로 띄움
  - `WeatherHomeView.vue`의 "지역별 날씨 현황" 패널: `@mouseenter="isPanelHovered = true"` / `@mouseleave="isPanelHovered = false"` — 마우스가 패널 위에 있는 동안에만 Enter 키 입력을 감지해서 지도/카드 보기를 토글하도록 조건으로 사용

### Step3: Weather Component
- 하나로 뭉쳐 있던 `WeatherDashboard.vue`를 역할별 컴포넌트로 분리
- 부모-자식 간 `props` / `emit` 이벤트 체계 정리 (`select-card`, `click-detail`, `update-query`)
- 서비스 소개 정적 페이지(`WeatherAboutView.vue`) 신규 작성
- `BaseDashboardCard.vue`에서 slot 활용: named slot `header`(`<slot name="header">`)로 카드 제목 영역을, default slot(`<slot></slot>`)으로 카드 본문 영역을 부모가 채워 넣을 수 있게 구성
  - `$slots.header` 존재 여부로 `v-if`를 걸어, header slot을 안 넘긴 카드(예: 하단 상태바 카드)는 제목 영역 자체가 렌더링되지 않도록 처리
  - 각 페이지에서 `<template #header>아이콘 + 제목</template>`으로 카드마다 다른 제목/본문을 채우면서도 카드의 공통 레이아웃(배경, 테두리, 그림자)은 재사용

### Step4: Weather Router
- `vue-router` 설정: `/`(대시보드), `/about`(서비스 소개), `/weather/:cityId`(도시 상세), `/:pathMatch(.*)*`(404 Not Found) 4개 라우트 구성
- 모든 라우트를 동적 `import()` 기반 지연 로딩(lazy loading)으로 전환
- `WeatherDetailView.vue` 신규 작성: 라우트 동적 파라미터(`cityId`)를 기준으로 해당 도시 상세 정보 표시, 존재하지 않는 도시는 안내 카드로 처리
- 상세보기 버튼 클릭 시 `window.alert()`를 제거하고 `router.push('/weather/' + id)`로 Programmatic Navigation 적용
- `App.vue`에 `RouterLink` 기반 대시보드 / 서비스 소개 탭 네비게이션 추가
- `NotFoundView.vue` 추가로 정의되지 않은 경로 접근 시 404 안내 및 대시보드 복귀 링크 제공

### Step5: Weather Store
- Pinia 스토어 `stores/configStore.js` 도입 (`main.js`에 `createPinia()` 등록)
- 온도 단위 상태(`unit`: celsius/fahrenheit), 단위 기호 getter(`unitSymbol`), 단위 토글 액션(`toggleUnit`), 섭씨→화씨 변환 액션(`convertTemp`) 구현
- `UnitToggler.vue` 컴포넌트로 단위 변경 버튼을 만들어 네비게이션 바에 배치
- `WeatherCard.vue` / `WeatherDetailView.vue`의 기온, 체감 온도, 더움/추움 배지 임계값(25℃/10℃)까지 전부 현재 선택된 단위 기준으로 환산해서 표시하도록 반영
- 체감 온도(`feelsLike`)도 기온과 동일하게 `configStore.convertTemp()`로 변환: `displayFeelsLike = computed(() => configStore.convertTemp(weather.feelsLike))` 형태로 별도 computed를 두어, 단위를 토글하면 기온뿐 아니라 체감 온도 표시(`{{ displayFeelsLike }}{{ configStore.unitSymbol }}`)도 함께 즉시 갱신되도록 처리

### Step6: Weather Axios
- `axios`로 OpenWeatherMap 실시간 날씨 API 연동
- 기존 mock 데이터(`data/weatherData.js`) 삭제, 도시 카탈로그(`data/koreaCities.js`)만 남기고 화면은 실시간 API 응답으로 구성
- 조회 대상 도시를 서울/수원/부산/인천/대전/대구/광주 7개로 확장
- API가 제공하지 않는 `status`(날씨 상태)는 OpenWeatherMap 날씨 코드(`weather[0].id`)를 기준으로 한 매핑 테이블(맑음/비/구름/눈/바람/폭우/안개)로 하드코딩 처리
- `WeatherDetailView.vue`도 mock 조회 대신 `cityId` 기준으로 API를 직접 재호출하도록 변경 (상세 페이지 새로고침에도 정상 동작)
- 한국 지도 SVG를 가공해 실제 지도 위에 도시 이름을 배치하는 `KoreaMap.vue` 컴포넌트 신규 구현
  - 도시 이름 클릭 시 해당 도시 날씨 카드를 지도 위에 고정(pin) / 재클릭 시 해제
  - "지도" / "카드" 두 가지 보기 탭 추가 (지도: `KoreaMap`, 카드: 기존 `WeatherCard` 그리드)
  - "지역별 날씨 현황" 패널에 마우스가 있는 동안 Enter 키를 누르면 두 보기를 토글하는 단축키 구현 (`window` `keydown` 리스너 + hover 상태 조합)
  - 도시 선택/해제 상태를 하단 상태바에도 실시간 반영
