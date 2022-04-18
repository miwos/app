import { createHobbyCurve } from 'hobby-curve'
import { computed } from 'vue'

import Vec from 'tiny-vec'
import { toRadians } from '../utils'
import { useInstances } from '@/stores/instances'
import { ConnectionPoint } from '@/types/Connection'
import { useModules } from '@/stores/modules'
import { useShapes } from '@/stores/shapes'

const getPointAndAngle = ({
  index,
  direction,
  instanceId,
}: ConnectionPoint): [Vec, number] => {
  const instance = useInstances().get(instanceId)
  const module = useModules().getByInstanceId(instanceId)
  const shape = useShapes().get(module.shapeId)

  const { inputs, outputs } = shape

  const isInput = direction === 'in'
  const inputOutput = isInput ? inputs[index] : outputs[index]
  if (!inputOutput)
    throw new Error(`Can't find ${isInput ? 'input' : 'output'}#${index}.`)

  const signal = isInput
    ? module.inputs[index]?.signal
    : module.outputs[index]?.signal

  const { position, angle } = inputOutput
  const point = new Vec(instance.position).add(
    signal === 'midi' ? position.inset : position.touching
  )

  return [point, angle]
}

export const useConnectionCurve = (
  from: ConnectionPoint,
  to: ConnectionPoint
) =>
  computed(() => {
    let [fromPoint, fromAngle] = getPointAndAngle(from)
    let [toPoint, toAngle] = getPointAndAngle(to)

    // For trigger icons (triangles) the line should start at the triangles tip.
    const getIconTip = (point: Vec, angle: number) =>
      point.add(new Vec(-9, 0).rotate(toRadians(angle)))

    if (from.signal === 'trigger') {
      fromPoint = getIconTip(fromPoint, fromAngle)
    }
    if (to.signal === 'trigger') {
      toPoint = getIconTip(toPoint, toAngle)
    }

    // The normalized distance.
    const distance = toPoint
      .subtract(fromPoint)
      .divide({ x: window.innerWidth, y: window.innerHeight })

    const c1 = fromPoint.add(
      new Vec(0, -1)
        .multiply(20 + Math.abs(distance.x * 50))
        .rotate(toRadians(fromAngle - 90))
    )

    const c2 = toPoint.add(
      new Vec(0, -1)
        .multiply(20 + Math.abs(distance.x * 50))
        .rotate(toRadians(toAngle - 90))
    )

    const controls = [c1, c2]
    const data = createHobbyCurve([fromPoint, ...controls, toPoint])

    return { data, controls }
  })
