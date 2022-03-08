<template>
  <div class="module-props">
    <ModuleProp
      v-for="(name, index) in displayPropNames"
      :name="(name as string)"
      :position="getPosition(index)"
      :side="index < 3 ? 'right' : 'left'"
      :value="instance.props.get(name)"
    />
  </div>
</template>

<script setup lang="ts">
import { Module } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { Shape } from 'shape-compiler'
import { computed, ComputedRef, inject, ref } from 'vue'
import ModuleProp from './ModuleProp.vue'

const module = inject<ComputedRef<Module>>('module')!
const shape = inject<ComputedRef<Shape>>('shape')!
const instance = inject<ComputedRef<ModuleInstance>>('instance')!

const displayPropNames = computed(() => {
  const names = []
  for (const [name, prop] of module.value.props.entries()) {
    if (prop.show) names.push(name)
  }
  return names
})

const getPosition = (index: number) => {
  const side = index < 3 ? 'right' : 'left'
  const count = Object.values(displayPropNames.value).length
  const positions = shape.value.props

  const position =
    side === 'right'
      ? count === 1
        ? positions.right.one
        : count === 2
        ? positions.right.two[index]
        : positions.right.three[index]
      : count === 4
      ? positions.left.one
      : count === 5
      ? positions.left.two[index - 3]
      : positions.left.three[index - 3]

  if (!position) throw new Error(`No position found for prop #${index}`)

  const offset = 8 * (side === 'left' ? 1 : -1)
  return { x: position.x + offset, y: position.y }
}
</script>
