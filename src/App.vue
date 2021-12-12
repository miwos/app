<template>
  <Splitpanes @resize="sideBar?.resize()">
    <Pane class="pane-patch">
      <AppPatch />
      <AppMenu />
    </Pane>
    <Pane v-if="false">
      <AppSidebar ref="sideBar" />
    </Pane>
  </Splitpanes>
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
</script>

<style lang="scss">
@import './styles/config.css';

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
  font-family: 'Vevey positive';
}

.pane {
  &-patch {
    position: relative;
  }
}

.splitpanes__splitter {
  width: 7px;
  background-color: var(--module-fill-color);
}
</style>
