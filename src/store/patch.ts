import { defineStore } from 'pinia'
import { useBridge } from '@/services/bridge'
import { createLuaPatch } from '../utils'
import { useConnections } from './connections'
import { useInstances } from './instances'
import { useLoa } from '@/services/loa'
// @ts-ignore
import { parse } from 'lua-json'
import { useModules } from './modules'
import { useShapes } from './shapes'

export const usePatch = defineStore('patch', {
  state: () => ({
    name: 'patch1',
  }),

  actions: {
    async load() {
      const loa = useLoa()
      const buffer = await loa.readFile(`lua/patches/${this.name}.lua`)
      if (!buffer) return
      const content = new TextDecoder().decode(buffer)

      // Ignore the `require()`s on the top of the patch and only parse the
      // return statement.
      const match = content.match(/return[\s]*{[\S\s]*}/)
      if (!match) return
      const patch = parse(match[0])

      const instances = useInstances()
      for (const [id, instance] of Object.entries<any>(patch.instances)) {
        instances.restore(
          +id,
          instance.Module,
          { x: 100, y: 100 },
          instance.props
        )
      }

      // const modules = useModules()
      // const shapes = useShapes()
      // const connections = useConnections()
      // for (const connection of patch.connections) {
      //   const [fromId, fromIndex, toId, toIndex] = connection
      //   const fromInstance = instances.get(fromId)
      //   const fromModule = modules.get(fromInstance.moduleId)
      //   const fromShape = shapes.get(fromModule.shapeId)
      // }
    },

    update() {
      const bridge = useBridge()
      if (bridge.isConnected.value)
        bridge.updatePatch(this.name, createLuaPatch())
    },

    clear() {
      useInstances().clear(false)
      useConnections().clear(false)
      this.update()
    },
  },
})
