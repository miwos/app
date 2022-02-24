export const throttle = (fn: Function, interval: number) => {
  let lastTime = 0
  let timeout: number

  return (...args: any) => {
    const now = performance.now()
    if (lastTime && now < lastTime + interval) {
      window.clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        lastTime = now
        fn(...args)
      }, interval)
    } else {
      lastTime = now
      fn(...args)
    }
  }
}
