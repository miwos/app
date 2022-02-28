<template>
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
</template>

<script setup lang="ts">
import { useEditor } from '@/store/editor'
import { useModules } from '@/store/modules'
import { useShapes } from '@/store/shapes'
import { basename, nameWithoutExt } from '@/utils'
import ShapePath from './ShapePath.vue'

const editor = useEditor()
const shapes = useShapes()
const modules = useModules()
</script>

<style scoped lang="scss">
.editor {
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
}
</style>
