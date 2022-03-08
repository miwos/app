import { useLoa } from '@/services/loa'
import {
  Module,
  ModuleInfo,
  ModuleInfoJson,
  ModuleInputOutput,
} from '@/types/Module'

export const parseSignal = (index: number): ModuleInputOutput['signal'] =>
  index === 1 ? 'midi' : 'trigger'

export const parseDirection = (index: number): ModuleInputOutput['direction'] =>
  index === 1 ? 'in' : 'out'

export const getInfo = async (moduleId: Module['id']): Promise<ModuleInfo> => {
  const response = await useLoa().sendRequest('/module/info', [moduleId])

  const info = JSON.parse(response) as ModuleInfoJson
  const shapeId = (info.shape ?? 'Round') as Module['shapeId']
  const props = new Map(Object.entries(info.props))

  const inputsOutputs = new Map(
    Object.values(info.inputsOutputs ?? {}).map((v: any) => {
      const direction = parseDirection(v.direction)
      const signal = parseSignal(v.signal)
      const { index } = v
      const id = `${direction}-${index}` as ModuleInputOutput['id']
      return [id, { id, index, direction, signal }]
    })
  )

  return { shapeId, props, inputsOutputs }
}
