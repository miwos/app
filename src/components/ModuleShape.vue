<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import { useModules } from '@/store/modules'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  type: string
  templateId: string
}>()

const el = ref<HTMLElement | null>(null)
const modules = useModules()

onMounted(() => {
  const shapeTemplate = document.getElementById(props.templateId)

  if (!shapeTemplate?.firstChild)
    throw new Error(`Can't find template for shape '${props.type}'`)

  el.value?.prepend(shapeTemplate.firstChild.cloneNode(true))
})
</script>
