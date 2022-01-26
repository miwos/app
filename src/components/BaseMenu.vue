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
  /* Light on dark font rendering isn't good on windows...
  but this might be too thin for MacOS */
  font-weight: 200;
  letter-spacing: 1px;
  font-size: 14px;
  color: var(--module-outline-color);
}
</style>
