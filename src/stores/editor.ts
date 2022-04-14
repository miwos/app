import { useLoa } from '@/services/loa'
import { EditorFile } from '@/types/Editor'
import { Module } from '@/types/Module'
import { nameWithoutExt } from '@/utils'
import { defineStore } from 'pinia'
import { computed, reactive, toRefs } from 'vue'
import { useInstances } from './instances'
import { useModules } from './modules'

export const useEditor = defineStore('editor', () => {
  const loa = useLoa()
  const modules = useModules()
  const instances = useInstances()

  const state = reactive({
    enabled: false,
    files: new Map<EditorFile['name'], EditorFile>(),
    focusedFileName: undefined as string | undefined,
  })

  // Getters
  const focusedFile = computed(() =>
    state.focusedFileName ? state.files.get(state.focusedFileName) : undefined
  )

  // Actions
  const open = async (name: string) => {
    state.enabled = true

    if (!state.files.has(name)) {
      const buffer = await loa.readFile(name)
      const content = new TextDecoder().decode(buffer ?? undefined)
      state.files.set(name, { name, content })
    }
    state.focusedFileName = name
  }

  const openModule = async (id: Module['id'], createBackup = false) => {
    state.enabled = true
    const name = `lua/modules/${id}.lua`
    await open(name)

    if (createBackup) {
      const backup = `lua/modules/__${id}.lua`
      await loa.renameFile(name, backup)
    }
  }

  const close = (name: string) => {
    const file = state.files.get(name)
    if (!file) return

    const index = Array.from(state.files.values()).indexOf(file)
    state.files.delete(name)

    const files = Array.from(state.files.values())
    const nextFile = files[index - 1] ?? files[files.length - 1]

    if (nextFile) {
      state.focusedFileName = nextFile.name
    } else {
      state.enabled = false
    }
  }

  const save = async (name: string, content: string) => {
    const file = state.files.get(name)
    if (!file) throw new Error(`File '${name}' doesn't exist.`)

    file.content = content
    const buffer = new TextEncoder().encode(content)
    await loa.writeFile(name, buffer)
  }

  const update = (name: string) => {
    const moduleId = nameWithoutExt(name)
    instances.list.forEach(
      (v) => v.moduleId === moduleId && (v.isUpdating = true)
    )
    return loa.updateFile(name)
  }

  const saveAndUpdate = async (name: string, content: string) => {
    await save(name, content)
    await update(name)
    await modules.updateFromDevice(nameWithoutExt(name))
  }

  return {
    ...toRefs(state),
    focusedFile,
    open,
    openModule,
    close,
    save,
    update,
    saveAndUpdate,
  }
})
