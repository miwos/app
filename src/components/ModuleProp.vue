<template>
  <div
    class="module-prop"
    :class="`side-${side}`"
    :style="{
      'z-index': mappingIsVisible ? 1 : undefined,
      top: props.position.y + 'px',
      left: props.position.x + 'px',
    }"
    ref="el"
  >
    <button class="module-prop-handle" @click="showMapping"></button>
    <div class="module-prop-content" ref="content">
      <button
        v-if="nameIsVisible"
        ref="name"
        class="module-prop-name"
        @click="showField"
        @focus="showField"
      >
        {{ props.name }}
      </button>
      <component
        v-if="fieldIsVisible"
        :is="components[type] ?? Number"
        v-bind="options"
        :value="value"
        ref="field"
        class="module-prop-field glass"
        @update:value="emit('update:value', $event)"
        @blur="hideField"
      />
    </div>
    <Teleport to="body">
      <MappingSelect
        v-if="mappingIsVisible"
        ref="mappingSelect"
        class="module-prop-mapping"
        :value="mapping?.slot"
        @update:value="updateMapping"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onMouseDownOutside } from '@/composables/onMouseDownOutside'
import { onMouseUpOutside } from '@/composables/onMouseUpOutside'
import { useApp } from '@/stores/app'
import { useMappings } from '@/stores/mappings'
import type { Module, Point } from '@/types'
import Number from '@/ui/MNumber.vue'
import { computed, nextTick, ref, type Component } from 'vue'
import MappingSelect from './MappingSelect.vue'

const props = defineProps<{
  name: string
  moduleId: Module['id']
  type: string
  value: unknown
  options: any
  position: Point
  side: 'left' | 'right'
}>()

const emit = defineEmits<{ (e: 'update:value', value: unknown): void }>()

const components: Record<string, Component> = { Number }

const app = useApp()
const el = ref<HTMLElement>()
const content = ref<HTMLElement>()

const field = ref<HTMLElement>()
const fieldIsVisible = ref(false)

const mappings = useMappings()
const mappingSelect = ref<HTMLElement>()
const mappingIsVisible = ref(false)
const mappingPosition = ref({ x: 0, y: 0 })
const mapping = mappings.getMapping(props.moduleId, props.name)

const name = ref<HTMLElement>()
const nameIsVisible = computed(
  () => app.showPropFields || !fieldIsVisible.value
)

const showField = async () => {
  if (app.showPropFields) return
  fieldIsVisible.value = true
  await nextTick()
  field.value?.focus()
}

const hideField = () => {
  if (app.showPropFields) return
  fieldIsVisible.value = false
}

let activeElement: Element | null
const showMapping = () => {
  // The mapping select is teleported and thereby breaking the tab flow. To let
  // the user continue where we left off before the mapping dialog we store the
  // currently focused element and restore it in `hideMapping()`.
  activeElement = document.activeElement
  const { top = 0, left = 0 } = content.value?.getBoundingClientRect() ?? {}
  mappingPosition.value = { x: left, y: top }
  mappingIsVisible.value = app.isMapping = true
}

const hideMapping = () => {
  mappingIsVisible.value = app.isMapping = false
  window.setTimeout(() => (activeElement as HTMLElement)?.focus())
}

const updateMapping = (slot: number) => {
  const { moduleId, name: prop } = props
  mappings.add(mappings.pageIndex, { slot, moduleId, prop })
  hideMapping()
}

onMouseUpOutside(el, hideField)
onMouseDownOutside(mappingSelect, hideMapping)
</script>

<style scoped lang="scss">
.module-prop {
  position: absolute;
  transform: translateY(-50%);
  gap: 0.5em;
  height: 2em;
  display: flex;
  align-items: center;

  &.side-left {
    transform: translate(-100%, -50%);
    flex-direction: row-reverse;
  }

  &-handle {
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: var(--color-module-bg);
    cursor: pointer;
    transition: fill var(--fade-duration);

    .mapped & {
      // A bit darker than the glass color.
      background-color: hsl(0deg 0% 29%);
    }

    .mapping-modal &,
    .mapped-current-page & {
      background-color: var(--mapping-color);
    }
  }

  &-content {
    position: relative;
  }

  &-name {
    font-family: 'Vevey Positive';
    font-size: 16px;
    text-transform: capitalize;
    white-space: nowrap;
    cursor: pointer;
  }

  &-field {
    display: flex;
    border-radius: var(--radius-xs);
    width: 6em;
    height: 1.5em;
    padding: 0 0.3em;
    box-sizing: border-box;
    font-weight: 300;
  }

  &-mapping {
    top: v-bind('mappingPosition.y + `px`');
    left: v-bind('mappingPosition.x + `px`');
  }
}
</style>

<style></style>
