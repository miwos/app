import { ref } from 'vue'

export const useRaf = (fn: FrameRequestCallback) => {
  const isActive = ref(false)

  const loop = (time: number) => {
    if (!isActive.value) return
    fn(time)
    window.requestAnimationFrame(loop)
  }

  const stop = () => (isActive.value = false)

  const start = () => {
    if (!isActive.value) {
      isActive.value = true
      window.requestAnimationFrame(loop)
    }
  }

  const toggle = (force?: boolean) => {
    const state = force ?? !isActive.value
    if (state) {
      start()
    } else {
      stop()
    }
  }

  return { isActive, start, stop, toggle }
}
