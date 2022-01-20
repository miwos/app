<template>
  <BaseMenu class="menu-parts glass">
    <ButtonCircleTriplet :value="0" />
    <svg
      width="75"
      height="112"
      viewBox="0 0 75 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <clipPath id="menu-parts-clip">
        <path
          d="M58.9287 0.501825C69.6996 2.95003 76.4464 13.6662 73.9982 24.437C67.2674 54.0487 53.9251 81.1286 35.6292 104.041C28.737 112.673 16.1525 114.083 7.52108 107.191C-1.11038 100.298 -2.52033 87.714 4.37188 79.0825C18.9972 60.7665 29.6315 39.1613 34.9935 15.5713C37.4417 4.80044 48.1579 -1.94638 58.9287 0.501825Z"
        />
      </clipPath>
    </svg>
  </BaseMenu>
</template>

<script setup lang="ts">
import BaseMenu from './BaseMenu.vue'
import ButtonCircleTriplet from './ButtonCircleTriplet.vue'
</script>

<style lang="scss" scoped>
.menu-parts {
  position: absolute;
  bottom: 3.5rem;
  right: 0;
  clip-path: url(#menu-parts-clip);
  // Override base menu height;
  height: auto;

  &:deep(.button-circle) {
    position: absolute;

    &:nth-child(1) {
      top: 0;
      left: 34.5px;
    }

    &:nth-child(2) {
      top: 37.73px;
      left: 21.3px;
    }

    &:nth-child(3) {
      top: 71.56px;
      left: 0;
    }
  }
}

.button-circle-triplet {
  --color: #6171ff;
}
</style>
