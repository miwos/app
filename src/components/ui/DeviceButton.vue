<template>
  <button class="device-button"><slot></slot></button>
</template>

<style lang="scss" scoped>
.device-button {
  --size: 2rem;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background-color: var(--color);
  border: 2.5px solid var(--border-color);

  &:not(.active) {
    filter: saturate(0.5);
  }
}
</style>
