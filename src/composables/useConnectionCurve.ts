import { createHobbyCurve } from 'hobby-curve'
import { computed } from 'vue'

import Vec from 'tiny-vec'
import { toRadians } from '../utils'

export const useConnectionCurve = (
  fromModule: Module,
  outputIndex: number,
  toModule: Module,
  inputIndex: number
) =>
  computed(() => {
    const fromAngle = fromModule.outputs[outputIndex - 1].angle
    const toAngle = toModule.inputs[inputIndex - 1].angle

    const from = new Vec({
      // Index is one-based to be consistent with lua so we have to decrease it.
      x: fromModule.position.x + fromModule.outputs[outputIndex - 1].delta.x,
      y: fromModule.position.y + fromModule.outputs[outputIndex - 1].delta.y,
    })

    const to = new Vec({
      // Index is one-based to be consistent with lua so we have to decrease it.
      x: toModule.position.x + toModule.inputs[inputIndex - 1].delta.x,
      y: toModule.position.y + toModule.inputs[inputIndex - 1].delta.y,
    })

    const delta = new Vec(to).subtract(from)

    const x = delta.x / 100 + (delta.x > 0 ? 10 : -10)
    const y = Math.abs(delta.y / 10) + 20

    const dx = delta.x / window.innerWidth
    const dy = delta.y / window.innerHeight

    // const factor = Math.abs(dx * 0.2 + (1 - dy) * 0.8) * dx

    // console.log(dx * 0.8 + (1 - dy) * 0.2)

    const a = toAngle - dx * 45
    const p2 = to.add(
      new Vec(0, -1).multiply(20 + Math.abs(dy * 100)).rotate(toRadians(a))
    )

    const b = fromAngle - dx * 45
    const p1 = from.add(
      new Vec(0, -1).multiply(20 + Math.abs(dy * 100)).rotate(toRadians(b))
    )

    // const p1 = from.add({ x, y })
    // const p2 = to.subtract({ x, y })

    // const normal = delta.normal().normalize()
    // const dir = delta.x < 0 ? -1 : 1

    // const p3 = from.add(delta.multiply(0.3)).add(normal.multiply(100 * dir))
    // const p4 = to.subtract(delta.multiply(0.3)).add(normal.multiply(-100 * dir))

    const handles = [p1, p2]
    // const handles = delta.y > 0 ? [p1, p2] : [p1, p3, p4, p2]

    return { description: createHobbyCurve([from, ...handles, to]), handles }
  })
