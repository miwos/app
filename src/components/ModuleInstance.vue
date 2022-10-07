<template>
  <div class="module-instance" ref="el">Module</div>
</template>

<script setup lang="ts">
import { useDraggable } from '@/composables/useDraggable'
import type { Point } from '@/types/Point'
import { ref, watch } from 'vue'

const props = defineProps<{ position: Point }>()
const emit = defineEmits<{ (e: 'update:position', position: Point): void }>()

const el = ref<HTMLElement>()
const { position } = useDraggable(el)

watch(position, (position) => emit('update:position', position))
</script>

<style scoped lang="scss">
.module-instance {
  position: absolute;
  top: v-bind('props.position.y + `px`');
  left: v-bind('props.position.x + `px`');
  height: 100px;
  width: 100px;
}
</style>
