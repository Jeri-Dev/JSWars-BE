export const groupBy = <T>(data: T[], key: keyof T): Record<string, T[]> => {
  return data.reduce(
    (acc, item) => {
      const group = item[key] as unknown as string
      if (!acc[group]) {
        acc[group.toString()] = []
      }
      acc[group].push(item)
      return acc
    },
    {} as Record<string, T[]>,
  )
}
