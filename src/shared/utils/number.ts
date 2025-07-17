export function calcularPercentageVariation(
  current: number,
  previous: number,
): string {
  if (previous === 0) return 'N/A'
  const variation = ((current - previous) / previous) * 100
  const formatted = `${Math.abs(variation).toFixed(1).slice(0, 3)}% ${variation >= 0 ? '+' : '-'}`
  return formatted
}
