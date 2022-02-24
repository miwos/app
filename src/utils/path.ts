export const basename = (filename: string) =>
  filename.substring(filename.lastIndexOf('/') + 1)

export const nameWithoutExt = (filename: string) =>
  basename(filename).split('.').slice(0, -1).join('.')
