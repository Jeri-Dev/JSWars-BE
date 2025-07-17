export const replaceDynamicString = (
  str: string,
  options: Record<string, string> = {},
) => {
  return str.replace(/{{\s*(\w+)\s*}}/g, (_, varName) => {
    return Object.prototype.hasOwnProperty.call(options, varName)
      ? options[varName]
      : 'DINAMYC_VALUE'
  })
}
