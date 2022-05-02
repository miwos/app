<template>
  <div
    class="input"
    ref="el"
    @click="isFocused = true"
    :class="{ focused: isFocused }"
  >
    <MidiDeviceCombo
      :value="instance.props.get('device')?.value"
      preferredAlignment="above"
      @update:value="updateProp('device', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { onMouseDownOutside } from '@/composables/onMouseDownOutside'
import { useInstances } from '@/stores/instances'
import { ComputedRef, inject, ref } from 'vue'
import MidiDeviceCombo from '../components/MidiDeviceCombo.vue'
import { ModuleInstance } from '../types/ModuleInstance'

const el = ref<HTMLDivElement | null>(null)
const isFocused = ref(false)
const instance = inject<ComputedRef<ModuleInstance>>('instance')!
const instances = useInstances()

onMouseDownOutside(el, () => (isFocused.value = false))

const updateProp = (name: string, value: number) =>
  instances.updateProp(instance.value.id, name, value)
</script>

<style scoped lang="scss">
.input {
  position: absolute;
  left: 50%;
  bottom: 100%;
  width: unset;
  white-space: nowrap;
  color: white;
  transform: translateX(-50%);
  margin-bottom: 0.1rem;

  &.focused {
    z-index: var(--z-modal);
  }
}
</style>
