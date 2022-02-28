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
      <BaseMenu
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
  action?: Function
  children?: MenuItem[]
  open?: boolean
}

const props = defineProps<{
  menu: MenuItem[]
}>()

const emit = defineEmits<{
  (e: 'select', item: MenuItem): void
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
  item.action?.()
  emit('select', item)
  // if (item.children) {
  //   openedIndex.value = index
  // } else {
  // }
}
</script>

<style scoped lang="scss">
@use '@/styles/utilities';

.menu {
  @include utilities.glass;
  @include utilities.font-menu;

  --input-height: 1.5em;
  --option-height: 23px;
  --radius: var(--radius-s);

  position: absolute;
  display: flex;
  flex-direction: column;
  width: 10em;
  color: white;
  border-radius: var(--radius);
  z-index: var(--z-modal);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      var(--glass-color-solid),
      transparent 7em calc(100% - 5em),
      var(--glass-color-solid)
    );
    border-radius: var(--radius);
    z-index: -1;
  }

  &-item {
    height: var(--option-height);
    display: flex;
    align-items: center;
    padding: 0 var(--radius);
    cursor: pointer;

    &:first-child {
      padding-top: 2px;
      border-top-left-radius: var(--radius);
      border-top-right-radius: var(--radius);
    }

    &:last-child {
      padding-bottom: 2px;
      border-bottom-left-radius: var(--radius);
      border-bottom-right-radius: var(--radius);
    }
  }

  &-item.is-focused {
    @include utilities.glass-darker;

    &:not(:last-child, :first-child) {
      margin: -1px 0;
      padding-top: 1px;
      padding-bottom: 1px;
    }
  }
}

// .menu {
//   min-width: 5em;
//   max-width: 7em;
//   --radius: var(--radius-s);
//   border-radius: var(--radius);
//   @include utilities.glass;
// }

// .menu-item {
//   display: block;
//   white-space: nowrap;

//   &.has-children {
//     position: relative;
//     background-color: green;
//     .menu {
//       position: absolute;
//       top: 0;
//       left: 100%;
//     }
//   }

//   &.is-focused {
//     background-color: red;
//   }
// }
</style>
