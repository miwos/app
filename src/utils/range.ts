export const range = (size: number, startAt = 0) =>
  Array(size)
    .fill(0)
    .map((_, i) => i + startAt)
