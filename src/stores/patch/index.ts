import { useLoa } from '@/services/loa'
import { useConnections } from '@/stores/connections'
import { useEncoders } from '@/stores/encoders'
import { useInstances } from '@/stores/instances'
import { PatchSerialized } from '@/types/Patch'
// @ts-ignore
import * as luaJson from 'lua-json'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { serializePatch } from './utils'

export const usePatch = defineStore('patch', () => {
  const loa = useLoa()
  const instances = useInstances()
  const connections = useConnections()
  const encoders = useEncoders()

  const state = reactive({
    name: 'patch1',
  })

  // Actions
  const restore = (serialized: PatchSerialized) => {
    instances.restore(serialized.instances)
    connections.restore(serialized.connections)
    encoders.restore(serialized.encoders)
  }

  const load = async () => {
    const buffer = await loa.readFile(`lua/patches/${state.name}.lua`)
    if (!buffer) return

    const content = new TextDecoder().decode(buffer)
    const patch = luaJson.parse(content) as PatchSerialized

    clear(false)
    restore(patch)
  }

  const save = () => {
    let patch = luaJson.format(serializePatch())
    // `lua-json` converts all numerical ids to strings so we convert them back
    // manually.
    patch = patch.replace(/\['(\d)']/g, (_: string, id: string) => `[${id}]`)

    const buffer = new TextEncoder().encode(patch)
    return loa.writeFile(`lua/patches/${state.name}.lua`, buffer)
  }

  const update = async () => {
    await save()
    await loa.sendRequest('/patch/update', state.name)
  }

  const clear = (updateDevice = true) => {
    instances.clear(false)
    connections.clear(false)
    if (updateDevice) update()
  }

  return { ...toRefs(state), restore, load, save, update, clear }
})
