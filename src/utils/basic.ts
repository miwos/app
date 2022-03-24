export const { isArray } = Array

export const isObject = (arg: any) =>
  !!arg && typeof arg === 'object' && !isArray(arg)

export const asArray = (value: any) => (Array.isArray(value) ? value : [value])
