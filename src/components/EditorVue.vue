<template>
  <div class="editor">
    <EditorTablist />
    <EditorDocument ref="editorDocument" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import EditorTablist from './EditorTablist.vue'

const EditorDocument = defineAsyncComponent(
  () => import('./EditorDocument.vue')
)

const editorDocument = ref<InstanceType<typeof EditorDocument>>()

const resize = () => editorDocument.value?.resize()

defineExpose({ resize })
</script>

<style lang="scss">
.editor {
  height: 100%;
  display: flex;
  flex-direction: column;

  &.not-connected {
    pointer-events: none;
    opacity: 0.5;
  }

  &-document {
    flex: 1;
  }
}
</style>
