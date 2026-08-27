import axios from 'axios'

const API_KEY = '87b2b433e08ddd7f1fe32bb6a7cbf2de'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const STATUS_MOOD = {
  clear: { status: '맑음', mood: '산책하기 좋은 날' },
  rain: { status: '비', mood: '집콕하기 좋은 날' },
  clouds: { status: '구름', mood: '느긋하게 보내기 좋은 날' },
  snow: { status: '눈', mood: '따뜻하게 쉬기 좋은 날' },
  wind: { status: '바람', mood: '기분 전환하기 좋은 날' },
  heavyRain: { status: '폭우', mood: '창가에서 쉬기 좋은 날' },
  fog: { status: '안개', mood: '조용히 집중하기 좋은 날' },
}

// OpenWeatherMap 날씨 상태 코드(weather[0].id) 기준 분류
// https://openweathermap.org/weather-conditions
function getStatusMood(weatherId) {
  if (weatherId >= 200 && weatherId <= 232) return STATUS_MOOD.heavyRain // 뇌우
  if (weatherId >= 300 && weatherId <= 321) return STATUS_MOOD.rain // 이슬비
  if (weatherId >= 500 && weatherId <= 501) return STATUS_MOOD.rain // 약한~보통 비
  if (weatherId >= 502 && weatherId <= 531) return STATUS_MOOD.heavyRain // 강한 비, 소나기
  if (weatherId >= 600 && weatherId <= 622) return STATUS_MOOD.snow
  if (weatherId === 771 || weatherId === 781) return STATUS_MOOD.wind // 돌풍, 토네이도
  if (weatherId >= 701 && weatherId <= 762) return STATUS_MOOD.fog // 안개, 연무, 황사 등
  if (weatherId >= 801 && weatherId <= 804) return STATUS_MOOD.clouds
  return STATUS_MOOD.clear // 800 맑음 및 그 외 기본값
}

export async function fetchCityWeather({ id, name, query }) {
  const res = await axios.get(`${BASE_URL}?q=${query}&appid=${API_KEY}&units=metric&lang=kr`)
  return {
    id,
    name,
    temp: Math.round(res.data.main.temp),
    feelsLike: Math.round(res.data.main.feels_like),
    wind: `${res.data.wind.speed}m/s`,
    ...getStatusMood(res.data.weather[0].id),
  }
}
