import { useLoa } from '@/services/loa'
import { EditorFile } from '@/types/Editor'
import { Module } from '@/types/Module'
import { nameWithoutExt } from '@/utils'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useInstances } from './instances'
import { useModules } from './modules'

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
    async openModule(id: Module['id'], shouldCreateBackup = false) {
      this.enabled = true
      const loa = useLoa()
      const name = `lua/modules/${id}.lua`
      await this.open(name)

      if (shouldCreateBackup) {
        const backup = `lua/modules/__${id}.lua`
        await loa.renameFile(name, backup)
      }
    },

    async restoreModule(id: Module['id']) {
      const loa = useLoa()
      console.log(await loa.readDirectory('lua/modules'))
    },

    async open(name: string) {
      this.enabled = true
      const loa = useLoa()

      if (!this.files.has(name)) {
        const buffer = await loa.readFile(name)
        const content = new TextDecoder().decode(buffer ?? undefined)
        this.files.set(name, { name, content })
      }
      this.focusedFileName = name
    },

    close(name: string) {
      const file = this.files.get(name)
      if (!file) return

      const index = Array.from(this.files.values()).indexOf(file)
      this.files.delete(name)

      const files = Array.from(this.files.values())
      const nextFile = files[index - 1] ?? files[files.length - 1]

      if (nextFile) {
        this.focusedFileName = nextFile.name
      } else {
        this.enabled = false
      }
    },

    async save(name: string, content: string) {
      const loa = useLoa()

      const file = this.files.get(name)
      if (!file) throw new Error(`File '${name}' doesn't exist.`)

      file.content = content
      const buffer = new TextEncoder().encode(content)
      await loa.writeFile(name, buffer)
    },

    async update(name: string) {
      const loa = useLoa()
      loa.updateFile(name)
      const moduleId = nameWithoutExt(name)
      useInstances().list.forEach(
        (v) => v.moduleId === moduleId && (v.isUpdating = true)
      )
    },

    async saveAndUpdate(name: string, content: string) {
      await this.save(name, content)
      await this.update(name)
      await useModules().updateInfo(nameWithoutExt(name))
    },
  },
})
