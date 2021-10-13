import { getOffset } from './'

export const getInputOutputDeltas = (el: HTMLElement) => {
  const bounds = el.getBoundingClientRect()

  const inputElements = Array.from(el.querySelectorAll('[data-input]'))
  const inputDeltas = inputElements.map((el) =>
    getOffset(bounds, el.getBoundingClientRect())
  )

  const outputElements = Array.from(el.querySelectorAll('[data-output]'))
  const outputDeltas = outputElements.map((el) =>
    getOffset(bounds, el.getBoundingClientRect())
  )

  return [inputDeltas, outputDeltas]
}
