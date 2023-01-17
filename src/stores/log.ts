// import { createColorize } from '@/utils'
import { highlightLuaDump } from '@/lua-dump'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Colors = Record<string, (input: string) => string>

const createColorize = (colors: Colors = {}) => {
  let MARKS = Object.keys(colors).toString().replace(/,/g, '|')
  let RE_BLOCK = new RegExp(
    `\\{((?:${MARKS})(?:\\.(?:${MARKS}))*?)\\s|(\\})|(.[^{}]*)`,
    'gi'
  )

  return (strings: TemplateStringsArray, ...args: any) => {
    const input = strings.reduce((a, s, i) => (a += args[--i] + s))
    let stack: { marks: string[]; raw: string }[] = [{ marks: [], raw: '' }]

    input.replace(RE_BLOCK, (block, open, close, other = '', pos) => {
      if (open) {
        other = block
        if (input.indexOf('}', pos) + 1) {
          stack.push({ marks: open.split('.').reverse(), raw: '' })
          return ''
        }
      }

      if (close) {
        other = block
        if (stack.length !== 1) {
          let { marks, raw } = stack.pop()!
          other = marks.reduce((acc, mark) => colors[mark](acc), raw)
        }
      }

      stack[stack.length - 1].raw += other
      return ''
    })

    return stack[0].raw
  }
}

export type LogType = 'info' | 'warn' | 'error'

// prettier-ignore
const marks = [
  'black', 'white', 'gray', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan',
  'success', 'info', 'warn', 'error', 'specialKey', 'key', 'complexType',
  'number', 'boolean', 'string'
]
const createMark = (name: string, input: string) =>
  `<span class="mark-${name}">${input}</span>`
const colors = Object.fromEntries(
  marks.map((name) => [name, (input: string) => createMark(name, input)])
)

const colorize = createColorize(colors)

export const useLog = defineStore('logs', () => {
  const lines = ref('')
  const maxLines = 1000

  const addLines = (text: string) => {
    lines.value += text
    lines.value = lines.value.split('\n').slice(-maxLines).join('\n') + '\n'
  }

  const log = (type: LogType, text: string) => {
    if (type === 'error') {
      text = text.replace(
        /^([\w\/]+\.lua:\d+):/,
        `<button class="log-file-link" onclick="window.postMessage({ method: 'launchEditor', file: '$1' })">$1</button>`
      )
    }
    addLines(colorize`<span class="mark-${type}">${text}</span>`)
  }

  const info = (text: string) => log('info', text)

  const warn = (text: string) => log('warn', text)

  const error = (text: string) => log('error', text)

  const clear = () => (lines.value = '')

  const dump = (dump: any) => {
    const highlighted = highlightLuaDump(
      dump,
      (value, type) => colors[type]?.(value) ?? ''
    )
    addLines(highlighted)
  }

  return { lines, log, info, warn, error, dump, clear }
})
