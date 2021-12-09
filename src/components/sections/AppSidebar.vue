<template>
  <LuaEditor ref="editor" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'

const LuaEditor = defineAsyncComponent(
  () => import('@/components/LuaEditor.vue')
)

const editor = ref<InstanceType<typeof LuaEditor>>()

// Cast as any, because child methods are not recognized for dynamic components.
const resize = () => (editor.value as any)?.resize()

defineExpose({ resize })
</script>
