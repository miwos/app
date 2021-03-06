import { reactive, Ref, ref, watch } from 'vue'
import { constrainPosition } from '../utils'

export const useDragElement = (el: Ref<HTMLElement | null>) => {
  const dragThreshold = 5 // px
  let mouseDownPosition = { x: 0, y: 0 }
  const position = reactive({ x: 0, y: 0 })
  const delta = reactive({ x: 0, y: 0 })
  const dimensions = reactive({ width: 0, height: 0 })
  const isDragging = ref(false)
  const initialized = ref(false)

  const handleMouseDown = (event: MouseEvent) => {
    if (el.value === null) return

    const { clientX, clientY } = event
    mouseDownPosition = { x: clientX, y: clientY }
    delta.x = clientX - position.x
    delta.y = clientY - position.y

    const { width, height } = el.value.getBoundingClientRect()
    dimensions.width = width
    dimensions.height = height

    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
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

    if (!isDragging.value) {
      const { x, y } = mouseDownPosition
      const distance = Math.hypot(clientX - x, clientY - y)
      if (distance > dragThreshold) isDragging.value = true
    }

    if (isDragging.value) {
      position.x = x
      position.y = y
    }
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

  watch(el, initialize)

  return { position, isDragging, delta, initialized }
}
