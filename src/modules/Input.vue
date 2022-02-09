<template>
  <div class="input">
    <MidiDeviceCombo
      :value="instance.propValues.device"
      @update:value="sendProp('device', $event.id)"
    />
  </div>
</template>

<script setup lang="ts">
import MidiDeviceCombo from '../components/MidiDeviceCombo.vue'
import { useBridge } from '../services/bridge'
import { ModuleInstance } from '../types/ModuleInstance'
import { inject } from 'vue'

const instance = inject<ModuleInstance>('instance')!
const bridge = useBridge()

const sendProp = (name: string, value: number) =>
  bridge.sendProp(instance.id, name, value)
</script>

<style scoped>
.input {
  position: absolute;
  top: 0;
  left: 50%;
  width: unset;
  white-space: nowrap;
  color: white;
  transform: translate(-50%, -100%);
  padding-bottom: 0.5rem;
}
</style>
