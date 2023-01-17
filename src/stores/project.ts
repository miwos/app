import { useBridge } from '@/bridge'
import type { ProjectSerialized } from '@/types'
import { debounce, jsonToLua, luaToJson } from '@/utils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useConnections } from './connections'
import { useDevice } from './device'
import { useMappings } from './mappings'
import { useModules } from './modules'

export const useProject = defineStore('project', () => {
  const partIndex = ref(0)
  const name = ref('test')
  const isSelecting = ref(false)

  const bridge = useBridge()
  const device = useDevice()
  const connections = useConnections()
  const modules = useModules()
  const mappings = useMappings()

  const folder = computed(() => `lua/projects/${name.value}`)
  const file = computed(() => `${folder.value}/part-${partIndex.value + 1}.lua`)

  bridge.on('/e/parts/select', ({ args: [index] }) => selectPart(index, false))

  bridge.on('/e/project/open', ({ args: [projectName] }) => {
    name.value = projectName
    partIndex.value = 0
    load()
  })

  // Actions
  const serialize = () => ({
    connections: connections.serialize(),
    modules: modules.serialize(),
    mappings: mappings.serialize(),
  })

  const save = debounce(() => {
    if (!device.isConnected) return
    const content = jsonToLua(serialize())
    return bridge.writeFile(file.value, content)
  }, 1000)

  const load = async () => {
    if (!device.isConnected) return
    const content = await bridge.readFile(file.value)
    console.log(content)
    const serialized = luaToJson(content) as ProjectSerialized
    modules.deserialize(serialized.modules)
    connections.deserialize(serialized.connections)
    mappings.deserialize(serialized.mappings)
  }

  const clear = (updateDevice = true) => {
    connections.clear()
    modules.clear()
    mappings.clear()
    if (updateDevice) device.update('/e/patch/clear')
  }

  const selectPart = (index: number, updateDevice = true) => {
    partIndex.value = index
    if (updateDevice) device.update('/e/parts/select', [index])
  }

  return {
    name,
    partIndex,
    isSelecting,
    serialize,
    save,
    load,
    clear,
    selectPart,
  }
})
