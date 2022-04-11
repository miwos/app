import { useLoa } from '@/services/loa'
import {
  Module,
  ModuleInfo,
  ModuleInfoSerialized,
  ModuleInputOutput,
  ModuleInputOutputSerialized,
} from '@/types/Module'
import { isObject } from '@/utils'
// @ts-ignore
import * as luaJson from 'lua-json'

const parseSignal = (index: number): ModuleInputOutput['signal'] =>
  index === 1 ? 'midi' : 'trigger'

const parseInputsOutputs = (
  value: ModuleInputOutputSerialized[]
): ModuleInputOutput[] => value.map((v) => ({ signal: parseSignal(v.signal) }))

export const getInfo = async (moduleId: Module['id']): Promise<ModuleInfo> => {
  const response = await useLoa().sendRequest('/module/info', [moduleId])

  const info = luaJson.parse(`return ${response}`) as ModuleInfoSerialized
  const { label } = info
  const shapeId = (info.shape ?? 'Round') as Module['shapeId']

  const props = new Map(
    info.props.sort((a, b) => a.index - b.index).map((v) => [v.name, v])
  )

  const inputs = info.inputs ? parseInputsOutputs(info.inputs) : []
  const outputs = info.outputs ? parseInputsOutputs(info.outputs) : []

  return { shapeId, label, props, inputs, outputs }
}
