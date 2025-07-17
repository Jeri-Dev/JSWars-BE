export const formatNumberPrice = (value: number, noDecimals = false) => {
  if (typeof value !== 'number') {
    throw new Error('formatNumber: value must be a number')
  }

  if (noDecimals) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
