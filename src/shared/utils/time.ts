export const stringHourToDate = (date: string) => {
  const [hour, minute] = date.split(':')
  const dateTime = new Date()
  dateTime.setHours(Number(hour))
  dateTime.setMinutes(Number(minute))
  return dateTime
}
