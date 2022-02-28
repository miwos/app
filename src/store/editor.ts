import { useBridge } from '@/services/bridge'
import { EditorFile } from '@/types/Editor'
import { nameWithoutExt } from '@/utils'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useInstances } from './instances'

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
    async open(name: string) {
      const { loa } = useBridge()
      this.enabled = true

      if (!this.files.has(name)) {
        const buffer = await loa.readFile(name)
        const content = new TextDecoder().decode(buffer ?? undefined)
        this.files.set(name, { name, content })
      }
      this.focusedFileName = name
    },

    async save(name: string, content: string) {
      const { loa } = useBridge()

      this.files.get(name)!.content = content
      const buffer = new TextEncoder().encode(content)

      await loa.writeFile(name, buffer)
    },

    async update(name: string) {
      const { loa } = useBridge()
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
