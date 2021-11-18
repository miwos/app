import { getOffset } from './'

const getCenter = (el: Element) => {
  const bounds = el.getBoundingClientRect()
  return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }
}

const getInformation = (bounds: DOMRect, el: Element) => {
  const angle = el.getAttribute('transform')?.match(/rotate\((-?\d+)/)?.[1]
  return {
    angle: angle ? parseInt(angle) : 0,
    delta: getOffset(bounds, getCenter(el)),
  }
}

export const getInputOutputInformation = (el: Element) => {
  const bounds = el.getBoundingClientRect()

  const inputElements = Array.from(el.querySelectorAll('[class^="input"]'))
  const inputs = inputElements.map((el) => getInformation(bounds, el))

  const outputElements = Array.from(el.querySelectorAll('[class^="output"]'))
  const outputs = outputElements.map((el) => getInformation(bounds, el))

  return [inputs, outputs]
}
