import { ShapeHandle, ShapeHandles } from '@/store/shapes'
import { getOffset, getCenter } from './'

const replaceIdWithClass = (str: string) => str.replaceAll(' id="', ' class="')

export const sanitizeShapeSVG = replaceIdWithClass

const parseHandlePlaceholder = (bounds: DOMRect, el: Element) => {
  const angle = el.getAttribute('transform')?.match(/rotate\((-?\d+)/)?.[1]
  return {
    angle: angle ? parseInt(angle) : 0,
    delta: getOffset(bounds, getCenter(el)),
  }
}

const getHandlePlaceholders = (el: SVGElement, type: ShapeHandle['type']) =>
  Array.from(el.querySelectorAll(`[class^="${type}"]`))

const getHandle = (
  el: SVGElement,
  bounds: DOMRect,
  type: ShapeHandle['type']
): ShapeHandle[] =>
  getHandlePlaceholders(el, type).map((el) => ({
    type,
    ...parseHandlePlaceholder(bounds, el),
  }))

export const parseShape = (el: SVGElement): ShapeHandles => {
  const bounds = el.getBoundingClientRect()
  const handles = {
    input: getHandle(el, bounds, 'input'),
    output: getHandle(el, bounds, 'output'),
    transform: getHandle(el, bounds, 'transform'),
  }
  return handles
}
