<template>
  <TheTopBar />
  <RouterView />
</template>

<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import { redo, undo } from './commands'
import TheTopBar from './components/TheTopBar.vue'

const keys = useMagicKeys()
watch(keys['Ctrl+Z'], (v) => v && undo())
watch(keys['Ctrl+Y'], (v) => v && redo())
</script>
