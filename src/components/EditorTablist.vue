<template>
  <div class="editor-tablist" role="tablist">
    <button
      v-for="[name, file] in editor.files"
      :key="name"
      role="tab"
      class="editor-tab"
      :class="{
        focused: editor.focusedFileName === name,
        unsaved: file.hasUnsavedChanges,
      }"
      @mousedown="editor.open(name)"
    >
      <ShapePath
        class="editor-tab-thumb"
        :shape="shapes.get(modules.get(nameWithoutExt(name)).shapeId)"
      />
      <div class="editor-tab-name">
        {{ basename(name) }}<span class="editor-tab-unsaved">*</span>
      </div>
      <div class="editor-tab-overlay">
        <button class="editor-tab-close" @click="editor.close(name)">
          <svg viewBox="0 0 10 10">
            <line x1="0" y1="0" x2="10" y2="10" />
            <line x1="0" y1="10" x2="10" y2="0" />
          </svg>
        </button>
      </div>
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
    --tab-background-color: #616161;
    --tablist-background-color: #373737;
    --tab-radius: 4px;

    display: flex;
    height: 2rem;
    gap: 0.5rem;
    padding: 0.4rem;
    background-color: var(--tablist-background-color);
    font-weight: 300;
    font-size: 14px;
    font-family: Inter;
  }

  &-tab {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    padding-right: 0.5em;
    padding-left: 0.5em;
    gap: 0.5em;
    border-radius: var(--tab-radius);
    color: var(--module-shape-color-lighter);
    cursor: pointer;

    &.focused,
    &:hover {
      background: var(--tab-background-color);
      color: white;
    }
  }

  &-tab:not(.unsaved) &-tab-unsaved {
    visibility: hidden;
  }

  &-tab-overlay {
    position: absolute;
    pointer-events: none;
    right: 0;
    width: 4em;
    height: 100%;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    border-radius: var(--tab-radius);
    background: linear-gradient(
      90deg,
      transparent,
      var(--tab-background-color) 70%
    );

    .editor-tab:not(:hover) & {
      display: none;
    }
  }

  &-tab-close {
    display: flex;
    padding: 0.3em;
    margin-right: 0.3em;
    pointer-events: all;
    height: 0.5em;

    &:hover svg {
      stroke: white;
    }

    svg {
      overflow: visible;
      stroke-linecap: butt;
      height: 100%;
      width: auto;
      stroke: var(--module-shape-color-lighter);
      stroke-width: 2px;
      vector-effect: non-scaling-stroke;
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
