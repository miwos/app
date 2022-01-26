<template>
  <div class="logger" ref="el">
    <div class="log" v-for="log of logs.logs" :class="`log-${log.type}`">
      {{ log.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useLogs } from '@/store/logs'

const el = ref<HTMLElement | null>(null)
const logs = useLogs()

logs.$subscribe(() => {
  nextTick(() => {
    if (el.value) el.value.scrollTop = el.value.scrollHeight
  })
})
</script>

<style scoped>
.logger {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: aqua;
  line-height: 1.3rem;
  height: calc(3 * 1.3rem);
  overflow-y: scroll;
}

.log-error {
  color: red;
}

.log-warn {
  color: orange;
}
</style>
