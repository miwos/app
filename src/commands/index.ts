// ? At some point this could be moved into a store ?
import { useParts } from '@/stores/parts'

export * from './connection'
export * from './instance'
export * from './mapping'
export * from './patch'

interface Command {
  undo: Function
  redo: Function
  name: string
}

interface Stack {
  commands: Command[]
  index: number
}

// Use multiple stacks, so each patch part can use it's own.
let stacks: Stack[] = []

const getCurrentStack = () => {
  const index = useParts().currentIndex
  stacks[index] ??= { commands: [], index: 0 }
  return stacks[index]
}

export const undo = () => {
  const stack = getCurrentStack()
  stack.commands[stack.index--]?.undo()
  stack.index = Math.max(stack.index, -1)
}

export const redo = () => {
  const stack = getCurrentStack()
  stack.commands[++stack.index]?.redo()
  stack.index = Math.min(stack.index, stack.commands.length - 1)
}

export const pushCommand = (name: string, fn: Function) => {
  const stack = getCurrentStack()

  // The command `fn` returns a cleanup function we use as redo.
  const undo = fn()

  // If we're starting to push new commands while we have undo-ed into the
  // command history we'll delete all 'future' commands.
  stack.commands = stack.commands.slice(0, stack.index + 1)
  stack.commands.push({ undo, redo: fn, name })

  stack.index = stack.commands.length - 1
}
