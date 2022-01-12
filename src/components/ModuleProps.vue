<template>
  <div class="props">
    <ModuleProp
      v-for="(prop, name) in props.props"
      :name="name"
      :prop="prop"
      :value="values[name]"
      :encoder="interfaces.getEncoderId(instanceId, name).value"
      @update:encoder="interfaces.mapEncoder($event, instanceId, name)"
      @update:value="sendPropValue(name, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { useBridge } from '@/bridge'
import { useInterfaces } from '@/store/interfaces'
import type { Prop } from '@/store/modules'
import ModuleProp from './ModuleProp.vue'

const props = defineProps<{
  props: Record<string, Prop>
  values: Record<string, any>
  instanceId: number
}>()

const interfaces = useInterfaces()
const bridge = useBridge()

const sendPropValue = (name: string, value: number) => {
  bridge.sendProp(props.instanceId, name, value)
}
</script>
