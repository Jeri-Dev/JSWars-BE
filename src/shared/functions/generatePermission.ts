type PermissionObject<T extends string, A extends string> = {
  [K in A as `${T}_${K}`]: `${T}:${K}`
}

export const generatePermission = <T extends string, A extends string>(
  name: T,
  actions: readonly A[] | A[],
): PermissionObject<T, A> => {
  const result = {} as PermissionObject<T, A>

  for (const action of actions) {
    const key = `${name.toUpperCase()}_${action}`
    result[key as keyof PermissionObject<T, A>] =
      `${name.toUpperCase()}:${action}` as any
  }

  return result
}
