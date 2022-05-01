<template>
  <div
    class="module-prop"
    ref="el"
    :class="{
      mapped: !!mappingInfo,
      'mapped-current-page':
        mappingInfo?.pageIndex === encoders.currentPageIndex,
      focus: isFocused,
      'mapping-modal': shouldShowMapping,
      'side-left': side === 'left',
      'side-right': side === 'right',
    }"
  >
    <div class="module-prop-handle" @mousedown.prevent="showMapping"></div>
    <div class="module-prop-content">
      <button
        class="module-prop-name"
        v-if="isViewModeVerbose || !isFocused"
        @mousedown="onInputMouseDown"
      >
        {{ props.name }}
      </button>
      <component
        v-if="isViewModeVerbose || isFocused"
        :is="(type && inputComponents[type]) ?? BaseInput"
        class="module-prop-input"
        ref="input"
        :value="value"
        v-bind="data"
        @update:value="updateProp($event)"
      />
      <ModulePropMapping
        v-if="shouldShowMapping"
        ref="mapping"
        :value="mappingInfo?.encoder?.id"
        @update:value="updateMapping"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { mapEncoder } from '@/commands'
import { onMouseDownOutside } from '@/composables/onMouseDownOutside'
import { useApp } from '@/stores/app'
import { useEncoders } from '@/stores/encoders'
import { useInstances } from '@/stores/instances'
import { Module, ModuleProp } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { Point } from '@/types/Point'
import type { Component } from 'vue'
import { computed, ComputedRef, inject, nextTick, ref } from 'vue'
import BaseInput from './BaseInput.vue'
import ModulePropMapping from './ModulePropMapping.vue'
import PropButtonInput from './PropButtonInput.vue'
import PropListInput from './PropListInput.vue'

const props = defineProps<{
  name: string
  value: any
  type?: string
  data: ModuleProp
  position: Point
  side: 'left' | 'right'
}>()

const app = useApp()
const encoders = useEncoders()
const instances = useInstances()
const instance = inject<ComputedRef<ModuleInstance>>('instance')!

const el = ref<HTMLElement | null>(null)
const input = ref<HTMLElement | null>(null)
const mapping = ref<HTMLElement | null>(null)
const shouldShowMapping = ref(false)
const mappingInfo = encoders.getMapped(instance.value.id, props.name)
const isFocused = ref(false)
const isViewModeVerbose = computed(() => app.viewMode === 'verbose')

const inputComponents: Record<string, Component> = {
  list: PropListInput,
  button: PropButtonInput,
}

const updateProp = (value: number) =>
  instances.updateProp(instance.value.id, props.name, value)

const updateMapping = (id: number) => {
  mapEncoder(encoders.currentPageIndex, id, instance.value.id, props.name)
  hideMapping()
}

const showMapping = () => {
  shouldShowMapping.value = app.isMapping = true
}

const hideMapping = () => {
  shouldShowMapping.value = app.isMapping = false
}

onMouseDownOutside(mapping, hideMapping)

onMouseDownOutside(el, () => (isFocused.value = false))

const onInputMouseDown = async () => {
  if (isViewModeVerbose.value) return
  isFocused.value = true
  await nextTick()
  input.value?.focus?.()
}
</script>

<style lang="scss" scoped>
.module-prop {
  position: absolute;
  transform: translateY(-50%);
  top: v-bind('position.y + `px`');
  left: v-bind('position.x + `px`');
  gap: 0.5em;
  height: 2em;

  display: flex;
  align-items: center;
  color: var(--module-outline-color);

  &.mapping-modal {
    z-index: var(--z-modal);
  }

  &.side-left {
    flex-direction: row-reverse;
    transform: translate(-100%, -50%);
  }

  &-content {
    position: relative;
    display: flex;
    gap: 0.25em;
  }

  &-handle {
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: var(--module-shape-color);
    transition: fill var(--fade-duration);
    cursor: pointer;

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
    text-transform: capitalize;
    white-space: nowrap;
    cursor: pointer;
  }
}
</style>

<style lang="scss">
@use '@/styles/utilities';
.module-prop-input {
  @include utilities.font-menu;
  @include utilities.glass;
  display: flex;
  border-radius: var(--radius-xs);
  width: 6em;
  height: 1.5em;
  padding: 0 0.3em;
  box-sizing: border-box;
}
</style>
