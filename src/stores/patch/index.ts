import { useLoa } from '@/services/loa'
import { useConnections } from '@/stores/connections'
import { useEncoders } from '@/stores/encoders'
import { useInstances } from '@/stores/instances'
import { PatchSerialized } from '@/types/Patch'
// @ts-ignore
import * as luaJson from 'lua-json'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { deserializeConnection } from '../connections/utils'
import { deserializeInstance } from '../instances/utils'
import { serializePatch } from './utils'

import defaultPatch from '@/defaultPatch.json'
import { useParts } from '../parts'
import { useDevice } from '../device'

export const usePatch = defineStore('patch', () => {
  const loa = useLoa()
  const instances = useInstances()
  const connections = useConnections()
  const encoders = useEncoders()
  const parts = useParts()
  const device = useDevice()

  const state = reactive({
    name: 'patch1',
  })

  // Actions
  const restore = (serialized: PatchSerialized) => {
    Object.entries(serialized.instances).forEach(([id, v]) =>
      instances.restore(parseInt(id), deserializeInstance(v), false)
    )

    serialized.connections.forEach((v) =>
      connections.restore(deserializeConnection(v), false)
    )

    encoders.restore(serialized.encoders)
  }

  const load = async (name: string, updateDevice = true) => {
    const buffer = await loa.readFile(`lua/patches/${name}.lua`)
    if (!buffer) return

    state.name = name
    const content = new TextDecoder().decode(buffer)
    const patch = luaJson.parse(content) as PatchSerialized

    console.log('load', patch)

    clear(false)
    restore(patch)
    if (updateDevice) loa.sendRequest('/patch/load', name)
  }

  const save = () => {
    if (!device.isConnected) return

    const serializedPatch = serializePatch()

    let patch = luaJson.format(serializedPatch)
    console.log('save', patch)

    // `lua-json` converts all numerical ids to strings so we convert them back
    // manually.
    patch = patch.replace(/\['(\d+)']/g, (_: string, id: string) => `[${id}]`)

    const buffer = new TextEncoder().encode(patch)
    return loa.writeFile(`lua/patches/${state.name}.lua`, buffer)
  }

  const update = async () => {
    if (!device.isConnected) return
    await save()
    await loa.sendRequest('/patch/update', state.name)
  }

  const reset = async () => {
    clear()

    let patch = luaJson.format(defaultPatch)

    // `lua-json` converts all numerical ids to strings so we convert them back
    // manually.
    patch = patch.replace(/\['(\d+)']/g, (_: string, id: string) => `[${id}]`)

    const patchBuffer = new TextEncoder().encode(patch)
    await loa.writeFile(`lua/patches/patch1.lua`, patchBuffer)

    const emptyPatchBuffer = new TextEncoder().encode(
      'return { instances = {}, encoders = {{}, {}, {}}, connections = {} }'
    )
    await loa.writeFile(`lua/patches/patch2.lua`, emptyPatchBuffer)
    await loa.writeFile(`lua/patches/patch3.lua`, emptyPatchBuffer)

    useParts().select(0)
    useEncoders().selectPage(0)
  }

  const clear = (updateDevice = true) => {
    encoders.clear(false)
    connections.clear(false)
    instances.clear(false)
    if (updateDevice) update()
  }

  return { ...toRefs(state), restore, load, save, update, clear, reset }
})
