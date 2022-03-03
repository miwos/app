<template>
  <div ref="el" class="editor-logs">
    <div class="editor-logs-header">
      <button>error</button>
      <button>warn</button>
      <button>log</button>
    </div>
    <div class="editor-logs-container">
      <div
        class="editor-log"
        v-for="log of logs.items"
        :class="`log-${log.type}`"
      >
        {{ log.text }}
      </div>
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

<style scoped lang="scss">
.editor-logs {
  display: flex;
  flex-direction: column;
  height: 100%;

  background-color: black;
  font-family: monospace;
  color: #d4d4d4; // Same as vscode theme's default text color.

  box-sizing: border-box;
}

.editor-logs-header {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0 0.5em;
  height: 2rem;
  background-color: inherit;
  border-bottom: 1px solid hsl(0deg 0% 12%);
}

.editor-logs-container {
  flex: 1;
  overflow-y: scroll;
  padding: 1em;
  padding-top: 0;

  &::-webkit-scrollbar {
    width: 14px;
  }
  &::-webkit-scrollbar-track {
    background: hsl(0, 0%, 7%);
  }
  &::-webkit-scrollbar-thumb {
    background-color: hsl(0, 0%, 20%);
  }
}

.editor-log {
  &.log-warn {
    color: yellow;
  }

  &.log-error {
    color: red;
  }
}
</style>
