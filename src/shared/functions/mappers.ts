type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S

type KeysToCamelCase<T> = {
  [K in keyof T as SnakeToCamelCase<string & K>]: T[K] extends Record<
    string,
    any
  >
    ? KeysToCamelCase<T[K]>
    : T[K]
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export function mapKeysToCamelCase<T extends Record<string, any>>(
  obj: T,
): KeysToCamelCase<T> {
  if (obj === null || typeof obj !== 'object' || obj instanceof Date) {
    return obj as KeysToCamelCase<T>
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => mapKeysToCamelCase(item)) as KeysToCamelCase<T>
  }

  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key)

    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result[camelKey] = mapKeysToCamelCase(value)
    } else if (Array.isArray(value)) {
      result[camelKey] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? mapKeysToCamelCase(item)
          : item,
      )
    } else {
      result[camelKey] = value
    }
  }

  return result as KeysToCamelCase<T>
}
