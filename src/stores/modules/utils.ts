import { useLoa } from '@/services/loa'
import {
  Module,
  ModuleInfo,
  ModuleInfoSerialized,
  ModuleInputOutput,
  ModuleInputOutputSerialized,
} from '@/types/Module'

const parseSignal = (index: number): ModuleInputOutput['signal'] =>
  index === 1 ? 'midi' : 'trigger'

const parseInputsOutputs = (
  value: Record<number, ModuleInputOutputSerialized>
): ModuleInputOutput[] =>
  Object.values(value).map((v) => ({
    signal: parseSignal(v.signal),
  }))

export const getInfo = async (moduleId: Module['id']): Promise<ModuleInfo> => {
  const response = await useLoa().sendRequest('/module/info', [moduleId])

  const info = JSON.parse(response) as ModuleInfoSerialized
  const shapeId = (info.shape ?? 'Round') as Module['shapeId']
  const props = new Map(
    Object.values(info.props)
      .sort((a, b) => a.index - b.index)
      .map((v) => [v.name, v])
  )

  const inputs = info.inputs ? parseInputsOutputs(info.inputs) : []
  const outputs = info.outputs ? parseInputsOutputs(info.outputs) : []

  return { shapeId, props, inputs, outputs }
}
