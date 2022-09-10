<template>
  <Story>
    <MButtonCircle
      color="red"
      @click="hstEvent('Click', $event)"
    ></MButtonCircle>
  </Story>
</template>

<script setup lang="ts">
import { hstEvent } from 'histoire/client'
import MButtonCircle from './MButtonCircle.vue'
</script>
