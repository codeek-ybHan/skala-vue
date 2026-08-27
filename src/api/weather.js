import axios from 'axios'

const API_KEY = '87b2b433e08ddd7f1fe32bb6a7cbf2de'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export async function fetchCityWeather({ id, name, query }) {
  const res = await axios.get(`${BASE_URL}?q=${query}&appid=${API_KEY}&units=metric&lang=kr`)
  return {
    id,
    name,
    temp: Math.round(res.data.main.temp),
    feelsLike: Math.round(res.data.main.feels_like),
    status: res.data.weather[0].description,
    mood: res.data.weather[0].description,
    wind: `${res.data.wind.speed}m/s`,
  }
}
