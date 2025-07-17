export function dynamicMillisecondsToCronExpression(
  milliseconds: number,
): string {
  const seconds = Math.round(milliseconds / 1000)
  const minutes = Math.round(milliseconds / (60 * 1000))
  const hours = Math.round(milliseconds / (60 * 60 * 1000))
  const days = Math.round(milliseconds / (24 * 60 * 60 * 1000))

  if (seconds < 60) {
    return `*/${seconds} * * * * *`
  }

  if (minutes < 60) {
    return `*/${minutes} * * * *`
  }

  if (hours < 24) {
    return `0 */${hours} * * *`
  }

  if (days >= 1) {
    return `0 0 */${days} * *`
  }

  return '* * * * *'
}
