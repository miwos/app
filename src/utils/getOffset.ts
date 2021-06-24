export const getOffset = (parentBounds: Point, bounds: Point) => ({
  x: Math.round(bounds.x - parentBounds.x),
  y: Math.round(bounds.y - parentBounds.y),
})
