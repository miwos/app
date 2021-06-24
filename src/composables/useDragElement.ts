import { computed, reactive, Ref, ref, watch } from 'vue'
import CSS from 'csstype'
import { constrainPosition } from '../utils'

export const useDragElement = (el: Ref<HTMLElement | null>) => {
  const position = reactive({ x: 0, y: 0 })
  const delta = reactive({ x: 0, y: 0 })
  const dimensions = reactive({ width: 0, height: 0 })
  const isDragging = ref(false)
  const initialized = ref(false)

  const handleMouseDown = (event: MouseEvent) => {
    if (el.value === null) return

    const { clientX, clientY } = event
    delta.x = clientX - position.x
    delta.y = clientY - position.y

    const { width, height } = el.value.getBoundingClientRect()
    dimensions.width = width
    dimensions.height = height

    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)

    isDragging.value = true
  }

  const handleMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event

    const newPosition = {
      x: clientX - delta.x,
      y: clientY - delta.y,
    }

    const { x, y } = constrainPosition(
      newPosition,
      { width: dimensions.width, height: dimensions.height },
      { width: window.innerWidth, height: window.innerHeight }
    )

    position.x = x
    position.y = y
  }

  const handleMouseUp = () => {
    delta.x = 0
    delta.y = 0

    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('mousemove', handleMouseMove)

    isDragging.value = false
  }

  const initialize = (el: HTMLElement | null) => {
    if (el === null) return

    const { x, y } = el.getBoundingClientRect()
    position.x = Math.round(x)
    position.y = Math.round(y)

    el.addEventListener('mousedown', handleMouseDown)
    initialized.value = true
  }

  const style = computed(() =>
    initialized.value
      ? ({
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging.value ? 'grab' : 'pointer',
        } as CSS.Properties)
      : {}
  )

  watch(el, initialize)
  return { position, style, isDragging, delta, initialized }
}
