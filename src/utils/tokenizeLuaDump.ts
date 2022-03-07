type TokenType =
  | 'specialKey'
  | 'key'
  | 'complexType'
  | 'number'
  | 'boolean'
  | 'string'

const token = (token: string, type: TokenType) =>
  `<span class="token-${type}">${token}</span>`

const indent = (depth: number) => '  '.repeat(depth)

const trimBrackets = (string: string) => string.slice(1, -1)

const highlightKey = (key: string): string => {
  if (/^(_G|_VERSION)$/.test(key)) {
    // Special global lua key
    return token(key, 'specialKey')
  } else if (/^\[(table|(light)?function)\]$/.test(key)) {
    // Complex data type representation
    return `[${token(trimBrackets(key), 'complexType')}]`
  } else if (/^\[\d+\]$/.test(key)) {
    // Number
    return `[${token(trimBrackets(key), 'number')}]`
  } else if (typeof key === 'string') {
    // String
    return token(key, 'key')
  } else {
    return key
  }
}

const tokenizeValue = (value: string): string => {
  if (/^(table|(light)?function)$/.test(value)) {
    // Complex data type representation
    return token(value, 'complexType')
  } else if (typeof value === 'number') {
    // Number
    return token(value, 'number')
  } else if (typeof value === 'boolean') {
    // Boolean
    return token(value, 'boolean')
  } else {
    // String
    return token(`'${value}'`, 'string')
  }
}

const tokenizeTable = (obj: Record<any, any>, depth: number = 0): string => {
  const keys = Object.keys(obj)
  if (!keys.length) return '{}'

  let str = '{\n'
  let index = 0
  for (const key of keys.sort()) {
    const value = obj[key]
    const highlightedKey = highlightKey(key)
    const highlightedValue =
      typeof value === 'object'
        ? tokenizeTable(value, depth + 1)
        : tokenizeValue(value)

    str += indent(depth + 1) + `${highlightedKey} = ${highlightedValue}`
    str += index < keys.length ? ',\n' : '\n'
    index++
  }
  return str + indent(depth) + '}'
}

/**
 * Highlight and format the dump object from lua for printing it to the console.
 */
export const tokenizeLuaDump = (dump: Array<any>) =>
  dump
    .map((v) => (typeof v === 'object' ? tokenizeTable(v) : tokenizeValue(v)))
    .join('\n')
