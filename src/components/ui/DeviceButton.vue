<template>
  <button class="device-button"><slot></slot></button>
</template>

<style lang="scss" scoped>
.device-button {
  --size: 1.4rem;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background-color: transparent;
  border: 1.5px solid var(--color);

  &.active {
    background-color: var(--color);
  }
}
</style>
