<template>
  <div class="menu">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.menu {
  --size: 2.5rem;

  display: flex;
  align-items: center;
  height: var(--size);
  margin: 1rem;

  border-radius: calc(var(--size) / 2);
  background-color: rgb(15, 15, 15, 0.15);
  backdrop-filter: blur(20px);

  z-index: var(--z-menu);
}
</style>
