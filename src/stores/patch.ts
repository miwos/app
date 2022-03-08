import { create, restore } from '@/lua-patch'
import { useLoa } from '@/services/loa'
import { useConnections } from '@/stores/connections'
import { useInstances } from '@/stores/instances'
import { LuaPatch } from '@/types/LuaPatch'
// @ts-ignore
import { parse } from 'lua-json'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

export const usePatch = defineStore('patch', () => {
  const loa = useLoa()
  const instances = useInstances()
  const connections = useConnections()

  const state = reactive({
    name: 'patch1',
  })

  // Actions
  const load = async () => {
    const buffer = await loa.readFile(`lua/patches/${state.name}.lua`)
    if (!buffer) return

    const content = new TextDecoder().decode(buffer)
    // Ignore the `require()`s on the top of the patch and only parse the
    // return statement.
    const match = content.match(/return[\s]*{[\S\s]*}/)
    if (!match) return

    const patch = parse(match[0]) as LuaPatch
    clear(false)
    restore(patch)
  }

  const save = () => {
    const patch = create()
    const buffer = new TextEncoder().encode(create())
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

  return { ...toRefs(state), load, save, update, clear }
})
