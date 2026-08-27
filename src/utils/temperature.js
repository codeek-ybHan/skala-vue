export function convertTemp(celsius, unit) {
  if (unit === 'fahrenheit') return Math.round((celsius * 9) / 5 + 32)
  return celsius
}
