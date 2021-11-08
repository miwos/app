import { getOffset } from './'

const getCenter = (el: Element) => {
  const bounds = el.getBoundingClientRect()
  return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }
}

export const getInputOutputDeltas = (el: HTMLElement) => {
  const bounds = el.getBoundingClientRect()

  const inputElements = Array.from(el.querySelectorAll('[class^="input"]'))
  const inputDeltas = inputElements.map((el) =>
    getOffset(bounds, getCenter(el))
  )

  const outputElements = Array.from(el.querySelectorAll('[class^="output"]'))
  const outputDeltas = outputElements.map((el) =>
    getOffset(bounds, getCenter(el))
  )

  return [inputDeltas, outputDeltas]
}
