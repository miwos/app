<template>
  <div class="editor">
    <Splitpanes horizontal @resize="resize()">
      <Pane class="editor-top-pane">
        <EditorTablist />
        <EditorDocument ref="editorDocument" />
      </Pane>
      <Pane>
        <EditorLogs ref="editorLogs" />
      </Pane>
    </Splitpanes>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import EditorTablist from './EditorTablist.vue'
// @ts-ignore
import { Splitpanes, Pane } from 'splitpanes'
import EditorLogs from './EditorLogs.vue'

const EditorDocument = defineAsyncComponent(
  () => import('./EditorDocument.vue')
)

const editorDocument = ref<InstanceType<typeof EditorDocument>>()
const editorLogs = ref<InstanceType<typeof EditorLogs>>()

const resize = () => {
  editorDocument.value?.resize()
  editorLogs.value?.resize()
}

defineExpose({ resize })
</script>

<style lang="scss">
.editor {
  height: 100%;

  &.not-connected {
    pointer-events: none;
    opacity: 0.5;
  }

  &-top-pane {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &-document {
    flex: 1;
  }
}
</style>
