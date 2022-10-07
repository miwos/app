<template>
  <story>
    <MSelect :options="[{ id: 'one' }, { id: 'two' }, { id: 'three' }]">
      <template #option="{ id }">yesh! {{ id }}</template>
    </MSelect>
  </story>
</template>

<script setup lang="ts">
import MSelect from './MSelect.vue'
</script>
