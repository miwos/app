<template>
  <div class="module-prop" :class="{ mapped: !!mappedEncoder }" @dblclick="map">
    <div class="module-prop-handle"></div>
    <div class="module-prop-name">
      <span>{{ props.name }}</span
      >&nbsp;=&nbsp;
      <input
        type="number"
        :value="props.value"
        @change="sendProp(parseInt(($event.target as any).value))"
      />
    </div>
    <div class="module-prop-mapping" v-if="showMapping">
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
import { useBridge } from '@/services/bridge'
import { useMapping } from '@/store/mapping'
import { ModuleInstance } from '@/types/ModuleInstance'
import { nextTick, ref } from 'vue'

const props = defineProps<{
  instanceId: ModuleInstance['id']
  name: string
  value: number
}>()

const mappingSelect = ref<HTMLElement | null>(null)
const mapping = useMapping()
const bridge = useBridge()
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
.module-prop {
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

  &-handle {
    width: 1rem;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: var(--module-shape-color);
    transition: fill var(--fade-duration);
    .mapped & {
      background-color: var(--mapping-color);
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
