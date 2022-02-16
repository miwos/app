<template>
  <div class="module-props">
    <ModuleProp
      v-for="(_, name, index) in displayProps"
      :name="name"
      :position="getPosition(index)"
      :side="index < 3 ? 'right' : 'left'"
      :value="values[name]"
    />
  </div>
</template>

<script setup lang="ts">
import { Module } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { Shape } from 'shape-compiler'
import { inject } from 'vue'
import ModuleProp from './ModuleProp.vue'

const module = inject<Module>('module')!
const shape = inject<Shape>('shape')!
const instance = inject<ModuleInstance>('instance')!

const displayProps = Object.fromEntries(
  Object.entries(module.props).filter(([, prop]) => prop.show ?? true)
) as Module['props']

const values = instance.propValues
const positions = shape.props

const count = Object.values(displayProps).length

const getPosition = (index: number) => {
  const side = index < 3 ? 'right' : 'left'

  const { x, y } =
    count === 1
      ? positions.right.one
      : count === 2
      ? positions.right.two[index]
      : count === 3
      ? positions.right.three[index]
      : null

  const offset = 13 * (side === 'left' ? -1 : 1)
  return { x: x + offset, y }
}
</script>
