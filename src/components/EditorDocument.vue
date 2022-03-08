<template>
  <div class="editor-document" ref="el" @keydown.ctrl="onKeyDown"></div>
</template>

<script setup lang="ts">
import { useEditor } from '@/stores/editor'
import { EditorFile } from '@/types/Editor'
import {
  connectLanguageServer,
  registerFormatting,
  registerLanguage,
} from '@monaco-lua/client'
import * as monaco from 'monaco-editor-core'
import editorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker'
import { markRaw, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
;(window as any).MonacoEnvironment = { getWorker: () => new editorWorker() }

registerLanguage(monaco as any)
registerFormatting(monaco as any)
connectLanguageServer(monaco, 'ws://localhost:8080')

const editor = useEditor()
const el = ref<HTMLElement | null>(null)
let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null
const models = new Map<string, monaco.editor.ITextModel>()

watch(editor.focusedFile, (v) => v && openFile(v))

onMounted(async () => {
  monacoEditor = markRaw(
    monaco.editor.create(el.value!, {
      theme: 'vs-dark',
      tabSize: 2,
      minimap: { enabled: false },
    })
  )
  if (editor.focusedFile.value) openFile(editor.focusedFile.value)
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
})

const onKeyDown = (e: KeyboardEvent) => {
  if (e.code === 'KeyS' && e.ctrlKey) {
    e.preventDefault()
    save()
  }
}

const openFile = (file: EditorFile) => {
  if (!models.has(file.name)) {
    models.set(file.name, createModel(file))
  }
  setModel(models.get(file.name)!)
}

const createModel = (file: EditorFile) => {
  const model = markRaw(monaco.editor.createModel(file.content, 'lua'))
  file.lastSavedVersionId = model.getAlternativeVersionId()
  model.onDidChangeContent(() => {
    file.hasUnsavedChanges =
      file.lastSavedVersionId !== model.getAlternativeVersionId()
  })
  return model
}

const setModel = (model: monaco.editor.ITextModel) => {
  monacoEditor?.setModel(model)
  // Add a blank line at the beginning of the document.
  // https://github.com/Microsoft/monaco-editor/issues/1333#issuecomment-468830253
  monacoEditor?.changeViewZones((changeAccessor) => {
    const domNode = document.createElement('div')
    changeAccessor.addZone({ afterLineNumber: 0, heightInLines: 1, domNode })
  })
}

const save = async () => {
  const name = editor.focusedFileName
  if (!name) return

  const model = models.get(name)
  if (!model) return

  await editor.saveAndUpdate(name, model.getValue())
  editor.focusedFile.value!.lastSavedVersionId = model.getAlternativeVersionId()
  editor.focusedFile.value!.hasUnsavedChanges = false
}

const resize = () => nextTick().then(() => monacoEditor?.layout())

defineExpose({ resize })
</script>
