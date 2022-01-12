import { getOffset } from './'
import { replaceIdWithClass } from './replaceIdWithClass'

const getCenter = (el: Element) => {
  const bounds = el.getBoundingClientRect()
  return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }
}

const parseHandlePlaceholder = (bounds: DOMRect, el: Element) => {
  const angle = el.getAttribute('transform')?.match(/rotate\((-?\d+)/)?.[1]
  return {
    angle: angle ? parseInt(angle) : 0,
    delta: getOffset(bounds, getCenter(el)),
  }
}

const scaleShape = (shape: SVGElement) => {
  const width = shape.getAttribute('width')
  if (width) {
    const rems = parseInt(width) / 16
    shape.style.width = `${rems * 0.35}rem`
  }
}

const createTempShape = (svg: string) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = svg.trim()

  const el = wrapper.firstChild as SVGElement
  el.classList.add('module-shape')
  wrapper.remove()

  return el
}

const createShapeTemplate = (el: SVGElement) => {
  const template = document.createElement('template')
  template.innerHTML = el.outerHTML
  return template
}

const getHandlePlaceholders = (el: SVGElement, type: HandleType) =>
  Array.from(el.querySelectorAll(`[class^="${type}"]`))

export const removeHandlePlaceholders = (el: SVGElement) => {
  getHandlePlaceholders(el, 'input').forEach((el) => el.remove())
  getHandlePlaceholders(el, 'output').forEach((el) => el.remove())
  getHandlePlaceholders(el, 'transform').forEach((el) => el.remove())
}

const getHandleDefinitions = (
  el: SVGElement,
  bounds: DOMRect,
  type: HandleType
): ModuleHandle[] =>
  getHandlePlaceholders(el, type).map((el) => ({
    type,
    ...parseHandlePlaceholder(bounds, el),
  }))

export const parseModuleShape = (el: SVGElement) => {
  const bounds = el.getBoundingClientRect()
  const handles = {
    inputs: getHandleDefinitions(el, bounds, 'input'),
    outputs: getHandleDefinitions(el, bounds, 'output'),
    transforms: getHandleDefinitions(el, bounds, 'transform'),
  }
  return handles
}
