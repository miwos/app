import { create, restore } from '@/lua-patch'
import { useLoa } from '@/services/loa'
import { LuaPatch } from '@/types/LuaPatch'
// @ts-ignore
import { parse } from 'lua-json'
import { defineStore } from 'pinia'

import { useConnections } from './connections'
import { useInstances } from './instances'

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

      const patch = parse(match[0]) as LuaPatch
      restore(patch)
    },

    async save() {
      const loa = useLoa()
      const buffer = new TextEncoder().encode(create())
      await loa.writeFile(`lua/patches/${this.name}.lua`, buffer)
    },

    async update() {
      const loa = useLoa()
      await this.save()
      await loa.sendRequest('/patch/update', this.name)
    },

    clear() {
      useInstances().clear(false)
      useConnections().clear(false)
      this.update()
    },
  },
})
