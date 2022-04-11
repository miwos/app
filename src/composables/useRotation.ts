import { Ref, ref, watch } from 'vue'

export const useRotation = (el: Ref<HTMLElement | null>) => {
  const angle = ref(0)
  const center = ref({ x: 0, y: 0 })
  const isRotating = ref(false)

  const initialize = (el: HTMLElement | null) => {
    if (el === null) return

    const { x, y, width, height } = el.getBoundingClientRect()
    center.value = { x: x + width / 2, y: y + height / 2 }

    el.addEventListener('mousedown', handleMouseDown)
  }

  const handleMouseDown = () => {
    isRotating.value = true
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
  }

  const handleMouseUp = () => {
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('mousemove', handleMouseMove)
  }

  const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
    angle.value =
      Math.atan2(clientX - center.value.x, -(clientY - center.value.y)) *
      (180 / Math.PI)
  }

  watch(el, initialize)

  return angle
}
