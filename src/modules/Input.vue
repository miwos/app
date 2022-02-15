<template>
  <div class="input">
    <MidiDeviceCombo :value="13" @update:value="setProp('device', $event)" />
  </div>
</template>

<script setup lang="ts">
import MidiDeviceCombo from '../components/MidiDeviceCombo.vue'
import { ModuleInstance } from '../types/ModuleInstance'
import { inject } from 'vue'
import { useInstances } from '@/store/instances'

const instance = inject<ModuleInstance>('instance')!
const instances = useInstances()

const setProp = (name: string, value: number) =>
  instances.setProp(instance.id, name, value)
</script>

<style scoped>
.input {
  position: absolute;
  left: 50%;
  bottom: 100%;
  width: unset;
  white-space: nowrap;
  color: white;
  transform: translateX(-50%);
  padding-bottom: 0.5rem;
}
</style>
