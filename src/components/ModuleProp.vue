<template>
  <div class="prop" @dblclick="map">
    <div class="prop-point"></div>
    <div class="prop-name">
      <span>{{ props.name }}</span
      >&nbsp;
      <input
        type="number"
        :value="props.value"
        @change="$emit('update:value', parseInt(($event.target as HTMLInputElement)?.value))"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  value: number
}>()

const map = () => {}
</script>

<style lang="scss" scoped>
.prop {
  display: flex;

  &-point,
  &-name {
    flex-shrink: 0;
  }

  &-point {
    width: 1em;
    height: 1em;
    border-radius: 50%;
    background-color: darkorchid;
  }
}

input {
  border: none;
  background-color: wheat;
  width: 3rem;
}
</style>
