<template>
  <div class="console glass-dark" ref="el">
    <button class="console-clear" @click="log.clear()">Clear</button>
    <div class="console-content">
      <div class="console-lines" v-html="log.lines"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLog } from '@/stores/log'
import { nextTick, ref } from 'vue'

const el = ref<HTMLElement>()
const log = useLog()

log.$subscribe(() => nextTick(() => scrollToBottom()))

const scrollToBottom = () =>
  el.value && (el.value.scrollTop = el.value.scrollHeight)
</script>

<style scoped lang="scss">
.console {
  --line-height: 1.2em;
  --lines: 10;

  position: absolute;
  left: 0;
  bottom: 0;
  z-index: var(--z-panel);

  margin: 1rem;

  border-radius: var(--radius-s);
  font-size: 10pt;

  &-clear {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0.5em;
  }

  &-content {
    width: 80ch;
    height: calc(var(--lines) * var(--line-height));
    line-height: var(--line-height);
    overflow-y: auto;

    margin: 0;
    padding: var(--line-height);
    white-space: pre-wrap;
    word-break: break-all;
    font-family: monospace;
  }
}
</style>

<style lang="scss">
.console {
  --color-console-black: black;
  --color-console-white: white;
  --color-console-gray: gray;
  --color-console-red: red;
  --color-console-green: green;
  --color-console-blue: blue;
  --color-console-yellow: yellow;
  --color-console-magenta: magenta;
  --color-console-cyan: cyan;

  --color-console-info: var(--color-console-white);
  --color-console-warn: var(--color-console-yellow);
  --color-console-error: var(--color-console-red);
  --color-console-success: var(--color-console-green);

  --color-console-key: var(--color-console-green);
  --color-console-specialKey: var(--color-console-cyan);
  --color-console-complexType: var(--color-console-magenta);
  --color-console-number: var(--color-console-red);
  --color-console-boolean: var(--color-console-blue);
  --color-console-string: var(--color-console-yellow);

  .mark-black {
    color: var(--color-console-black);
  }
  .mark-white {
    color: var(--color-console-white);
  }
  .mark-gray {
    color: var(--color-console-gray);
  }
  .mark-red {
    color: var(--color-console-red);
  }
  .mark-green {
    color: var(--color-console-green);
  }
  .mark-blue {
    color: var(--color-console-blue);
  }
  .mark-yellow {
    color: var(--color-console-yellow);
  }
  .mark-magenta {
    color: var(--color-console-magenta);
  }
  .mark-cyan {
    color: var(--color-console-cyan);
  }
  .mark-info {
    color: var(--color-console-info);
  }
  .mark-warn {
    color: var(--color-console-warn);
  }
  .mark-error {
    color: var(--color-console-error);
  }
  .mark-success {
    color: var(--color-console-success);
  }
  .mark-key {
    color: var(--color-console-key);
  }
  .mark-specialKey {
    color: var(--color-console-specialKey);
  }
  .mark-complexType {
    color: var(--color-console-complexType);
  }
  .mark-number {
    color: var(--color-console-number);
  }
  .mark-boolean {
    color: var(--color-console-boolean);
  }
  .mark-string {
    color: var(--color-console-string);
  }
}
</style>
