<template>
  <div
    class="module-prop"
    ref="el"
    :class="{
      mapped: !!mappedEncoder,
      'side-left': side === 'left',
      'side-right': side === 'right',
    }"
    @dblclick="map"
  >
    <div class="module-prop-handle"></div>
    <div class="module-prop-content">
      <button
        class="module-prop-name"
        v-if="isViewModeVerbose || !isFocused"
        @mousedown="onInputMouseDown"
      >
        {{ props.name }}
      </button>
      <BaseInput
        v-if="isViewModeVerbose || isFocused"
        ref="input"
        type="number"
        unit="♯"
        :value="props.value"
        v-bind="module.props.get(name)"
        @change="updateProp(parseFloat(($event.target as any).value))"
      />
    </div>

    <div class="module-prop-mapping" v-if="showMapping">
      <select
        ref="mappingSelect"
        :value="mappedEncoder?.id"
        @change="mapEncoder(parseInt(($event.target as any).value))"
        @blur="showMapping = false"
      >
        <option value="1">Encoder 1</option>
        <option value="2">Encoder 2</option>
        <option value="3">Encoder 3</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMouseDownOutside } from '@/composables/onMouseDownOutside'
import { useApp } from '@/stores/app'
import { useInstances } from '@/stores/instances'
import { useMapping } from '@/stores/mapping'
import { Module } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { Point } from '@/types/Point'
import { computed, ComputedRef, inject, nextTick, ref } from 'vue'
import BaseInput from './BaseInput.vue'

const props = defineProps<{
  name: string
  value: number
  position: Point
  side: 'left' | 'right'
}>()

const instance = inject<ComputedRef<ModuleInstance>>('instance')!
const module = inject<ComputedRef<Module>>('module')!

const el = ref<HTMLElement | null>(null)
const input = ref<HTMLElement | null>(null)
const mappingSelect = ref<HTMLElement | null>(null)
const app = useApp()
const mapping = useMapping()
const instances = useInstances()
const showMapping = ref(false)
const mappedEncoder = mapping.getMappedEncoder(instance.value.id, props.name)
const isFocused = ref(false)
const isViewModeVerbose = computed(() => app.viewMode === 'verbose')

onMouseDownOutside(el, () => (isFocused.value = false))

const onInputMouseDown = async () => {
  if (isViewModeVerbose.value) return
  isFocused.value = true
  await nextTick()
  input.value?.focus()
}

const updateProp = (value: number) =>
  instances.updateProp(instance.value.id, props.name, value)

const mapEncoder = (encoderId: number) =>
  mapping.mapEncoder(encoderId, instance.value.id, props.name)

const map = async () => {
  showMapping.value = true
  await nextTick()
  mappingSelect.value?.focus()
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

  &.side-left {
    flex-direction: row-reverse;
    transform: translate(-100%, -50%);
  }

  &-content {
    display: flex;
    gap: 0.25em;
  }

  &-handle {
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: red;
    background-color: var(--module-shape-color);
    transition: fill var(--fade-duration);
    .mapped & {
      background-color: var(--mapping-color);
    }
  }

  &-name {
    text-transform: capitalize;
    white-space: nowrap;
    cursor: pointer;
  }
}

input {
  display: block;
  border: none;
  background-color: transparent;
  font-family: inherit;
  color: inherit;
  font-size: inherit;
  width: 3rem;
  padding: 0;
}
</style>
