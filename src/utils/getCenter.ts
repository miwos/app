export const getCenter = (el: Element) => {
  const bounds = el.getBoundingClientRect()
  return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }
}
