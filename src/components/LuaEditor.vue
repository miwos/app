<template>
  <div class="editor" ref="el"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, markRaw, nextTick } from 'vue'
import * as monaco from 'monaco-editor-core'
import editorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker'
import {
  connectLanguageServer,
  registerLanguage,
  registerFormatting,
} from '@monaco-lua/client'
;(window as any).MonacoEnvironment = { getWorker: () => new editorWorker() }

registerLanguage(monaco)
registerFormatting(monaco)
// connectLanguageServer(monaco, 'ws://localhost:8080')

const el = ref<HTMLElement | null>(null)

let editor: monaco.editor.IStandaloneCodeEditor | null = null

onMounted(() => {
  editor = markRaw(
    monaco.editor.create(el.value!, {
      model: monaco.editor.createModel(
        `function test()\nprint('hello')\nend`,
        'lua'
      ),
      theme: 'vs-dark',
      tabSize: 2,
      minimap: { enabled: false },
    })
  )

  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
})

const resize = () => nextTick().then(() => editor?.layout())

defineExpose({ resize })
</script>

<style>
.editor {
  height: 100%;
}
</style>
