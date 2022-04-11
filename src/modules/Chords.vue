<template>
  <div class="chords">
    <div
      v-for="(_, index) in length"
      class="chord"
      :class="{
        active: index === playingIndex,
        empty: !chords[index],
        break: isArray(chords[index]),
      }"
    >
      <div class="name">
        <div class="line" v-for="line in asArray(chords[index])">
          {{ line }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMessage } from '@/composables/onMessage'
import { ref } from 'vue'
import { isArray, asArray } from '@/utils'
const chords = ref<(string | string[])[]>([])
const playingIndex = ref(0)

const props = defineProps<{
  length: number
}>()

const shouldBreakName = (name: string) => name?.length > 3

const breakName = (name: string) => {
  // ? break something like 'Fmadd9' after 'm' ?
  if (shouldBreakName(name)) {
    // Keep the note name (e.g.: `c` or `c#` on the first line).
    const breakIndex = name[1] === '#' ? 2 : 1
    return [name.substring(0, breakIndex), name.substring(breakIndex)]
  } else {
    return name
  }
}

onMessage('chord', (index, name) => {
  // zero-based index
  chords.value[index - 1] = name == 'empty' ? '' : breakName(name)
})

onMessage('play', (index) => (playingIndex.value = index - 1))
</script>

<style scoped lang="scss">
.chords {
  display: flex;
  height: 100%;
  gap: 7px;
  align-items: center;
  padding: 0 28px;

  .chord {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    padding: 0 3px;

    font-size: 10pt;
    line-height: 0.85;
    border-radius: 50%;
    color: var(--glass-color-solid);
    background-color: #c4c4c4;
    text-align: center;
    box-sizing: border-box;

    &.empty {
      background-color: #737373;
    }

    &.active {
      background-color: var(--active-color);
    }
  }

  .chord.break {
    // Two-line names look better with a little 'baseline shift'.
    padding-bottom: 4px;
  }

  .name {
    overflow: hidden;
  }

  .line {
    text-overflow: ellipsis;
    overflow: hidden;
    &:nth-child(2) {
      margin-top: -0.08em;
    }
  }
}
</style>
