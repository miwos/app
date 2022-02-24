<template>
  <div class="editor" :class="{ 'not-connected': !bridge.isConnected.value }">
    <div class="editor-tablist" role="tablist">
      <button
        v-for="[name] in editor.files"
        :key="name"
        role="tab"
        class="editor-tab"
        :class="{ focused: editor.focusedFileName === name }"
        @mousedown="editor.open(name)"
      >
        <ShapePath
          class="editor-tab-thumb"
          :shape="shapes.get(modules.get(nameWithoutExt(name)).shapeId)"
        />
        {{ basename(name) }}
      </button>
    </div>
    <div
      class="editor-document"
      ref="editorContainer"
      @keydown.ctrl="onKeyDown"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useBridge } from '@/services/bridge'
import { useEditor } from '@/store/editor'
import { useModules } from '@/store/modules'
import { useShapes } from '@/store/shapes'
import { basename, nameWithoutExt } from '@/utils'
import {
  connectLanguageServer,
  registerFormatting,
  registerLanguage,
} from '@monaco-lua/client'
import * as monaco from 'monaco-editor-core'
import editorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker'
import { markRaw, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import ShapePath from './ShapePath.vue'
;(window as any).MonacoEnvironment = { getWorker: () => new editorWorker() }

registerLanguage(monaco as any)
registerFormatting(monaco as any)
connectLanguageServer(monaco, 'ws://localhost:8080')

const editorContainer = ref<HTMLElement | null>(null)
let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null
const editor = useEditor()
const shapes = useShapes()
const modules = useModules()
const bridge = useBridge()

watch(editor.focusedFile, (v) => setModel(v?.model))

onMounted(async () => {
  monacoEditor = markRaw(
    monaco.editor.create(editorContainer.value!, {
      model: editor.focusedFile.value?.model,
      theme: 'vs-dark',
      tabSize: 2,
      minimap: { enabled: false },
    })
  )
  setModel(editor.focusedFile.value?.model)
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

const setModel = (model: monaco.editor.ITextModel) => {
  if (!model) return
  monacoEditor?.setModel(model)

  // Add a blank line at the beginning of the document.
  // https://github.com/Microsoft/monaco-editor/issues/1333#issuecomment-468830253
  monacoEditor?.changeViewZones((changeAccessor) => {
    const domNode = document.createElement('div')
    changeAccessor.addZone({ afterLineNumber: 0, heightInLines: 1, domNode })
  })
}

const save = () => {
  if (editor.focusedFileName) editor.saveAndUpdate(editor.focusedFileName)
}

const resize = () => nextTick().then(() => monacoEditor?.layout())

defineExpose({ resize })
</script>

<style scoped lang="scss">
.editor {
  height: 100%;
  display: flex;
  flex-direction: column;

  &.not-connected {
    pointer-events: none;
    opacity: 0.5;
  }

  &-tablist {
    display: flex;
    height: 2rem;
    gap: 0.5rem;
    padding: 6px;
    background-color: #373737;
    font-weight: 300;
    font-size: 14px;
    font-family: Inter;
  }

  &-tab {
    display: flex;
    align-items: center;
    height: 100%;
    padding-right: 0.5em;
    padding-left: 0.35em;
    gap: 0.3em;
    border-radius: 4px;

    color: var(--module-shape-color-lighter);

    &.focused,
    &:hover {
      background: #616161;
      color: white;
    }
  }

  &-tab-thumb {
    height: 70%;
    width: unset;
    aspect-ratio: 1/1;

    fill: var(--glass-color-solid);
    .focused & {
      fill: var(--module-shape-color-lighter);
    }
  }

  &-document {
    flex: 1;
  }
}
</style>
