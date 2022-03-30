<template>
  <div class="chords">
    <div
      v-for="chord in chords"
      class="chords-chord"
      :class="{ empty: !chord }"
    >
      {{ chord ? chord : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMessage } from '@/composables/onMessage'
import { ref } from 'vue'
const chords = ref(['C#7', false, 'F'])

onMessage('chord', (index, name) => {
  chords.value[index - 1] = name !== 'empty' && name // zero-based index
})
</script>

<style scoped lang="scss">
.chords {
  display: flex;
  height: 100%;
  gap: 7px;
  align-items: center;
  padding: 0 28px;

  &-chord {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    font-size: 11pt;
    border-radius: 50%;
    color: var(--glass-color-solid);
    background-color: #c4c4c4;
    text-align: center;

    &.empty {
      background-color: #737373;
    }
  }
}
</style>
