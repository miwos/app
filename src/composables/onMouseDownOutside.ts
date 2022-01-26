import { MaybeElementRef, unrefElement, useEventListener } from '@vueuse/core'

export const onMouseDownOutside = (
  target: MaybeElementRef,
  handler: (e: MouseEvent) => void
) => {
  const listener = (event: PointerEvent) => {
    const el = unrefElement(target)
    if (el && el !== event.target && !event.composedPath().includes(el)) {
      handler(event)
    }
  }

  return useEventListener(window, 'mousedown', listener, {
    passive: true,
    capture: true,
  })
}
