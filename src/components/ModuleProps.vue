<template>
  <div class="module-props">
    <ModuleProp
      v-for="(prop, name) in props.props"
      :name="name"
      :prop="prop"
      :value="values[name]"
      :instanceId="props.instanceId"
    />
  </div>
</template>

<script setup lang="ts">
import { ModuleProp as ModulePropType } from '@/types/Module'
import ModuleProp from './ModuleProp.vue'

const props = defineProps<{
  props: Record<string, ModulePropType>
  values: Record<string, any>
  instanceId: number
}>()
</script>
