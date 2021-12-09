<template>
  <Splitpanes class="default-theme" @resize="sideBar?.resize()">
    <Pane>
      <AppPatch />
    </Pane>
    <Pane>
      <AppSidebar ref="sideBar" />
    </Pane>
  </Splitpanes>
  <!-- <AppMenu /> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppPatch from './components/sections/AppPatch.vue'
import AppSidebar from './components/sections/AppSidebar.vue'
import AppMenu from './components/sections/AppMenu.vue'
import { useModules } from './store/modules'
// @ts-ignore
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const modules = useModules()
modules.init()

const sideBar = ref<InstanceType<typeof AppSidebar>>()

let sidebarSize = 0
</script>

<style lang="scss">
@import './config.css';

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

body {
  background-color: var(--background-color);

  &.dragging * {
    user-select: none;
  }
}

#app {
  width: 100%;
  height: 100%;
}
</style>
