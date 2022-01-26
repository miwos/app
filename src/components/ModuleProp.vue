<template>
  <div class="prop" @dblclick="map">
    <div class="prop-point" v-html="knobSvg"></div>
    <div class="prop-name">
      <span>{{ props.name }}</span
      >&nbsp;=&nbsp;
      <input
        type="number"
        :value="props.value"
        @change="sendProp(parseInt(($event.target as any).value))"
      />
    </div>
    <div class="prop-mapping" v-if="showMapping">
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
import { ref, nextTick } from 'vue'
import knobSvg from '@/assets/knob.svg?raw'
import { useMapping } from '@/store/mapping'
import { ModuleInstance } from '@/types/ModuleInstance'
import { useBridge } from '@/bridge'

const props = defineProps<{
  instanceId: ModuleInstance['id']
  name: string
  value: number
}>()

const mapping = useMapping()
const bridge = useBridge()

const mappingSelect = ref<HTMLElement | null>(null)
const showMapping = ref(false)

const mappedEncoder = mapping.getMappedEncoder(props.instanceId, props.name)

const sendProp = (value: number) =>
  bridge.sendProp(props.instanceId, props.name, value)

const mapEncoder = (encoderId: number) =>
  mapping.mapEncoder(encoderId, props.instanceId, props.name)

const map = async () => {
  showMapping.value = true
  await nextTick()
  mappingSelect.value?.focus()
}
</script>

<style lang="scss" scoped>
.prop {
  display: flex;
  align-items: center;
  gap: 0.5em;
  color: var(--module-outline-color);
  font-family: 'Vevey positive';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: antialiased;

  &-point,
  &-name {
    flex-shrink: 0;
  }

  &-point {
    --size: 1.4rem;
    width: var(--size);
    height: var(--size);
    &:deep(path) {
      fill: var(--module-shape-color);
    }
  }

  &-name {
    display: flex;
    text-transform: capitalize;
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
