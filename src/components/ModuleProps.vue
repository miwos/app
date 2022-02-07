<template>
  <div class="module-props">
    <ModuleProp
      v-for="(prop, name, index) in props.props"
      :name="name"
      :position="getPosition(index)"
      :side="index < 3 ? 'right' : 'left'"
      :value="values[name]"
      :instanceId="props.instanceId"
    />
  </div>
</template>

<script setup lang="ts">
import { Module } from '@/types/Module'
import { Shape } from 'shape-compiler'
import ModuleProp from './ModuleProp.vue'

const props = defineProps<{
  props: Module['props']
  values: Record<string, any>
  positions: Shape['props']
  instanceId: number
}>()

const count = Object.values(props.props).length

const getPosition = (index: number) => {
  const side = index < 3 ? 'right' : 'left'

  const { x, y } =
    count === 1
      ? props.positions.right.one
      : count === 2
      ? props.positions.right.two[index]
      : count === 3
      ? props.positions.right.three[index]
      : null

  const offset = 13 * (side === 'left' ? -1 : 1)
  return { x: x + offset, y }
}
</script>
