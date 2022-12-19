import { useProject } from '@/stores/project'
export * from './connections'
export * from './modules'
export * from './drag'

interface Command {
  undo: Function
  redo: Function
  name: string
}

interface Stack {
  commands: Command[]
  index: number
}

// Use a separate stack for each project part.
let stacks: Stack[] = []

const getCurrentStack = () => {
  const index = useProject().partIndex
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

export const pushCommand = async (name: string, fn: Function) => {
  const stack = getCurrentStack()

  // The command `fn` returns a cleanup function we use as redo.
  const undo = await fn()

  // If we're starting to push new commands while we have undo-ed into the
  // command history we'll delete all 'future' commands.
  stack.commands = stack.commands.slice(0, stack.index + 1)
  stack.commands.push({ undo, redo: fn, name })

  stack.index = stack.commands.length - 1
}
