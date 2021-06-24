type Point = { x: number; y: number }
type Size = { width: number; height: number }

export const constrainPosition = (
  position: Point,
  size: Size,
  constraint: Size
) => {
  let { x, y } = position

  if (position.x < 0) {
    x = 0
  } else if (position.x + size.width > constraint.width) {
    x = constraint.width - size.width
  }

  if (position.y < 0) {
    y = 0
  } else if (position.y + size.height > constraint.height) {
    y = constraint.height - size.height
  }

  return { x, y }
}
