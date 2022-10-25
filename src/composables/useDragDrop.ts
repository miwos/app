import { useEventListener } from '@vueuse/core'
import { ref, type Ref } from 'vue'

/**
 * Based on vueuse's `useDropZone()`, with additional drag information.
 * https://github.com/vueuse/vueuse/blob/main/packages/core/useDropZone/index.ts
 */
export const useDragDrop = (
  el: Ref<HTMLElement | undefined>,
  handleDrag: (e: DragEvent) => void,
  handleDrop: (e: DragEvent) => void
) => {
  const isDragging = ref(false)
  const isDraggedOver = ref(false)
  let counter = 0

  useEventListener<DragEvent>(el, 'dragstart', (event) => {
    isDragging.value = true
    handleDrag?.(event)
  })
  useEventListener<DragEvent>(el, 'dragend', (event) => {
    isDragging.value = false
  })
  useEventListener<DragEvent>(el, 'dragenter', (event) => {
    event.preventDefault()
    counter += 1
    isDraggedOver.value = true
  })
  useEventListener<DragEvent>(el, 'dragover', (event) => {
    event.preventDefault()
  })
  useEventListener<DragEvent>(el, 'dragleave', (event) => {
    event.preventDefault()
    counter -= 1
    if (counter === 0) isDraggedOver.value = false
  })
  useEventListener<DragEvent>(el, 'drop', (event) => {
    event.preventDefault()
    counter = 0
    isDraggedOver.value = false
    handleDrop?.(event)
  })

  return { isDragging, isDraggedOver }
}
