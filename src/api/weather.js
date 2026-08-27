import axios from 'axios'

const API_KEY = '87b2b433e08ddd7f1fe32bb6a7cbf2de'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const WEATHER_STATUS = {
  clear: '맑음',
  rain: '비',
  clouds: '구름',
  snow: '눈',
  wind: '바람',
  heavyRain: '폭우',
  fog: '안개',
}

// OpenWeatherMap 날씨 상태 코드(weather[0].id) 기준 분류
// https://openweathermap.org/weather-conditions
function getWeatherStatus(weatherId) {
  if (weatherId >= 200 && weatherId <= 232) return WEATHER_STATUS.heavyRain // 뇌우
  if (weatherId >= 300 && weatherId <= 321) return WEATHER_STATUS.rain // 이슬비
  if (weatherId >= 500 && weatherId <= 501) return WEATHER_STATUS.rain // 약한~보통 비
  if (weatherId >= 502 && weatherId <= 531) return WEATHER_STATUS.heavyRain // 강한 비, 소나기
  if (weatherId >= 600 && weatherId <= 622) return WEATHER_STATUS.snow
  if (weatherId === 771 || weatherId === 781) return WEATHER_STATUS.wind // 돌풍, 토네이도
  if (weatherId >= 701 && weatherId <= 762) return WEATHER_STATUS.fog // 안개, 연무, 황사 등
  if (weatherId >= 801 && weatherId <= 804) return WEATHER_STATUS.clouds
  return WEATHER_STATUS.clear // 800 맑음 및 그 외 기본값
}

export async function fetchCityWeather({ id, name, query }) {
  const res = await axios.get(`${BASE_URL}?q=${query}&appid=${API_KEY}&units=metric&lang=kr`)
  return {
    id,
    name,
    temp: Math.round(res.data.main.temp),
    feelsLike: Math.round(res.data.main.feels_like),
    wind: `${res.data.wind.speed}m/s`,
    status: getWeatherStatus(res.data.weather[0].id),
  }
}
