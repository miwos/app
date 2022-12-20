<template>
  <div class="module-prop" ref="el">
    <button class="module-prop-handle"></button>
    <div class="module-prop-content">
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
  </div>
</template>

<script setup lang="ts">
import { onMouseUpOutside } from '@/composables/onMouseUpOutside'
import { useApp } from '@/stores/app'
import type { Point } from '@/types'
import Number from '@/ui/MNumber.vue'
import { computed, nextTick, ref, type Component } from 'vue'

const props = defineProps<{
  name: string
  type: string
  value: unknown
  options: any
  position: Point
}>()

const emit = defineEmits<{ (e: 'update:value', value: unknown): void }>()

const components: Record<string, Component> = { Number }

const app = useApp()
const el = ref<HTMLElement>()
const field = ref<HTMLElement>()
const name = ref<HTMLElement>()
const fieldIsVisible = ref(false)
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

onMouseUpOutside(el, hideField)
</script>

<style scoped lang="scss">
.module-prop {
  position: absolute;
  transform: translateY(-50%);
  top: v-bind('props.position.y + `px`');
  left: v-bind('props.position.x + `px`');
  gap: 0.5em;
  height: 2em;
  display: flex;
  align-items: center;

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
}
</style>

<style></style>
