import { useBridge } from '@/services/bridge'
import { EditorFile } from '@/types/Editor'
import { nameWithoutExt } from '@/utils'
// import * as monaco from 'monaco-editor-core'
import type LuaOnArduino from 'lua-on-arduino'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useInstances } from './instances'

let loa: LuaOnArduino | null = null
let isInit = false
const init = async () => {
  if (isInit) return
  isInit = true
  const LuaOnArduino = (await import('lua-on-arduino')).default
  loa = new LuaOnArduino(useBridge().osc)
}

export const useEditor = defineStore('editor', {
  state: () => ({
    enabled: false,
    files: new Map<EditorFile['name'], EditorFile>(),
    focusedFileName: null as string | null,
  }),

  getters: {
    focusedFile: (state) =>
      computed(() =>
        state.focusedFileName
          ? state.files.get(state.focusedFileName) ?? null
          : null
      ),
  },

  actions: {
    async enable() {
      this.enabled = true
      await init()
    },

    disable() {
      this.enabled = false
    },

    async open(name: string) {
      if (!loa) throw new Error('Loa is not ready.')

      if (!this.files.has(name)) {
        const buffer = await loa.readFile(name)
        const content = new TextDecoder().decode(buffer ?? undefined)
        this.files.set(name, { name, content })
      }
      this.focusedFileName = name
    },

    async save(name: string, content: string) {
      if (!loa) throw new Error('Loa is not ready.')

      this.files.get(name)!.content = content
      const buffer = new TextEncoder().encode(content)

      await loa.writeFile(name, buffer)
    },

    async update(name: string) {
      if (!loa) throw new Error('Loa is not ready.')
      loa.updateFile(name)
      const moduleId = nameWithoutExt(name)
      useInstances().list.forEach(
        (v) => v.moduleId === moduleId && (v.isUpdating = true)
      )
    },

    async saveAndUpdate(name: string, content: string) {
      await this.save(name, content)
      await this.update(name)
    },

    close(name: string) {
      this.files.delete(name)
    },
  },
})
