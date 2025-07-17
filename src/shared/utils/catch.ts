type Result<T> = [null, T] | [Error, null]

export const tryCatch = async <T>(
  fn: () => T | Promise<T>,
): Promise<Result<T>> => {
  try {
    const result = await fn()
    return [null, result]
  } catch (error) {
    const errorObject =
      error instanceof Error ? error : new Error(String(error))
    return [errorObject, null]
  }
}
