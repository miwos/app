<template>
  <div class="menu">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.menu {
  margin: 1rem;
  z-index: var(--z-menu);

  font-family: 'Inter';
  font-weight: 300;
  letter-spacing: 1px;
  color: var(--module-outline-color);
}
</style>
