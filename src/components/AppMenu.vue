<template>
  <div
    class="menu"
    ref="el"
    role="menu"
    tabindex="-1"
    @keydown.arrow-up.stop="focusPrev"
    @keydown.arrow-down.stop="focusNext"
    @keydown.home.stop="focusFirst"
    @keydown.page-up.stop="focusFirst"
    @keydown.end.stop="focusLast"
    @keydown.page-down.stop="focusLast"
    @keydown.arrow-right.stop="select(focusedIndex)"
    @keydown.enter.stop="select(focusedIndex)"
    @mouseleave="focusedIndex = -1"
  >
    <div
      v-for="(item, index) in items"
      class="menu-item"
      :class="{
        'is-focused': index === focusedIndex,
        'has-children': item.children,
      }"
      @click="select(index)"
      @mouseenter="focus(index)"
    >
      {{ item.name }}
      <AppMenu
        v-if="item.children && index === openedIndex"
        :menu="item.children"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

interface MenuItem {
  name: string
  children?: MenuItem[]
  open?: boolean
}

const props = defineProps<{
  menu: MenuItem[]
}>()

const el = ref<HTMLElement | null>(null)
const items = ref(props.menu)
const focusedIndex = ref(-1)
const openedIndex = ref(-1)

onMounted(() => {
  el.value?.focus()
})

watch(focusedIndex, () => {
  if (focusedIndex.value !== openedIndex.value) {
    openedIndex.value = -1
  }
})

const focus = (index: number) => {
  const { length } = props.menu
  focusedIndex.value = index < 0 ? length - 1 : index >= length ? 0 : index
}

const focusNext = () => focus(focusedIndex.value + 1)
const focusPrev = () => focus(focusedIndex.value - 1)
const focusFirst = () => focus(0)
const focusLast = () => focus(props.menu.length - 1)

const select = (index: number) => {
  const item = items.value[index]
  if (item.children) {
    openedIndex.value = index
  } else {
  }
}
</script>

<style scoped lang="scss">
.menu {
  width: 5em;
}

.menu-item {
  display: block;

  &.has-children {
    position: relative;
    background-color: green;
    .menu {
      position: absolute;
      top: 0;
      left: 100%;
    }
  }

  &.is-focused {
    background-color: red;
  }
}
</style>
