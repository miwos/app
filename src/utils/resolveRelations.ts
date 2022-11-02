type Store = { get: (id: any) => any; $id: string }

type NonUndefined<T> = T extends undefined ? never : T

type Resolved<R extends Relations> = {
  [K in keyof R]: NonUndefined<ReturnType<R[K]['get']>>
}

type Relations = Record<string, Store>

export const resolveRelations = <T, R extends Relations>(
  data: T,
  relations: R
): Omit<T, keyof R> & Resolved<R> => {
  const resolved = {} as any
  for (const [field, store] of Object.entries(relations)) {
    const id = (data as any)[field]
    const item = store.get(id)
    if (!item)
      throw new Error(`failed to resolve '${id}' from store ${store.$id} `)
    resolved[field] = store.get(id)
  }

  return { ...data, ...(resolved as Resolved<R>) }
}
