<template>
  <div class="editor-wrapper">
    <EditorVue ref="editor" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EditorVue from './EditorVue.vue'

const editor = ref<InstanceType<typeof EditorVue>>()

const resize = () => editor.value?.resize()

defineExpose({ resize })
</script>

<style scoped lang="scss">
.editor-wrapper {
  background-color: #1e1e1e;
  height: 100%;
}
</style>
