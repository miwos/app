<template>
  <div class="module-label">
    <template v-if="positionedLabels.length">
      <ModuleLabelItem
        v-for="(label, index) in labels"
        :text="label"
        :info="shape.labels[index]"
      />
    </template>
    <div class="module-label-default" v-else>{{ labels[0] }}</div>
  </div>
</template>

<script setup lang="ts">
import { Shape } from 'shape-compiler'
import { computed, ComputedRef, inject } from 'vue'
import { Module } from '@/types/Module'
import { asArray } from '@/utils'
import { ModuleInstance } from '@/types/ModuleInstance'
import ModuleLabelItem from './ModuleLabelItem.vue'

const shape = inject<ComputedRef<Shape>>('shape')!
const module = inject<ComputedRef<Module>>('module')!
const instance = inject<ComputedRef<ModuleInstance>>('instance')!

const labels = computed(() =>
  asArray(instance.value.label ?? module.value.label)
)

const positionedLabels = computed(() =>
  labels.value.slice(0, shape.value.labels.length)
)
</script>

<style scoped lang="scss">
.module-label {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  user-select: none;
  white-space: pre-line;
  color: var(--module-outline-color);

  &-item-default {
    text-align: center;
  }
}
</style>
