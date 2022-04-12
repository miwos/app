export * from './instance'

let commands: { undo: Function; redo: Function; name: string }[] = []

let index = 0

export const undo = () => {
  commands[index--]?.undo()
  index = Math.max(index, -1)
}

export const redo = () => {
  commands[++index]?.redo()
  index = Math.min(index, commands.length - 1)
}

export const pushCommand = (name: string, fn: Function) => {
  // The command `fn` returns a cleanup function we use as redo.
  const undo = fn()

  // If we're starting to push new commands while we have undo-ed into the
  // command history we'll delete all 'future' commands.
  commands = commands.slice(0, index + 1)
  commands.push({ undo, redo: fn, name })

  index = commands.length - 1
}
