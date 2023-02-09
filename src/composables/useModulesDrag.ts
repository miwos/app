import { drag, endDrag, startDrag } from '@/commands'
import { useModules } from '@/stores/modules'
import type { Module } from '@/types'
import { useEventListener } from '@vueuse/core'
import type { Ref } from 'vue'

export const useModulesDrag = (
  el: Ref<HTMLElement | undefined>,
  module: Module
) => {
  const modules = useModules()
  const dragThreshold = 5 // px
  let positionMouseDown = { x: 0, y: 0 }

  const handleMouseMove = (event: MouseEvent) => {
    event.preventDefault()
    const { clientX, clientY } = event

    if (modules.isDragging) {
      drag({ x: clientX, y: clientY })
    } else {
      const { x, y } = positionMouseDown
      const distance = Math.hypot(clientX - x, clientY - y)

      if (distance > dragThreshold) {
        // Even if the drag is started on the module, we want to move the whole
        // group of selected modules if there are some.
        const group = modules.selectedItems.size
          ? Array.from(modules.selectedItems.values())
          : [module]

        startDrag(group, positionMouseDown)
        modules.isDragging = true
      }
    }
  }

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    endDrag()
    modules.isDragging = false
  }

  useEventListener<MouseEvent>(el, 'mousedown', (event) => {
    positionMouseDown = { x: event.clientX, y: event.clientY }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  })
}
