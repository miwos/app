import { defineStore } from 'pinia'
// import * as monaco from 'monaco-editor-core'
import type LuaOnArduino from 'lua-on-arduino'
import { useBridge } from '@/services/bridge'
import { computed, markRaw } from 'vue'
import { useInstances } from './instances'
import { nameWithoutExt } from '@/utils'

interface File {
  name: string
  model: any
}

let loa: LuaOnArduino | null = null
let monaco: any
let isInit = false
const init = async () => {
  if (isInit) return
  isInit = true
  const LuaOnArduino = (await import('lua-on-arduino')).default
  loa = new LuaOnArduino(useBridge().osc)
  monaco = await import('monaco-editor-core')
}

// const loa = new LuaOnArduino(useBridge().osc)

export const useEditor = defineStore('editor', {
  state: () => ({
    enabled: false,
    files: new Map<File['name'], File>(),
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
        const model = markRaw(monaco.editor.createModel(content, 'lua'))
        this.files.set(name, { name, model })
      }
      this.focusedFileName = name
    },

    async save(name: string) {
      if (!loa) throw new Error('Loa is not ready.')

      const content = this.files.get(name)?.model.getValue()
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

    async saveAndUpdate(name: string) {
      await this.save(name)
      await this.update(name)
    },

    close(name: string) {
      this.files.delete(name)
    },
  },
})
