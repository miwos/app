<template>
  <Splitpanes @resize="sideBar?.resize()">
    <Pane class="pane-patch">
      <AppPatch />
      <MenuMain />
      <MenuMapping />
      <MenuEncoders />
      <MenuModulesSearch />
      <MenuParts />
    </Pane>
    <Pane v-if="false">
      <AppSidebar ref="sideBar" />
    </Pane>
  </Splitpanes>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppPatch from './components/AppPatch.vue'
import AppSidebar from './components/AppSidebar.vue'
// @ts-ignore
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import MenuMain from './components/MenuMain.vue'
import MenuMapping from './components/MenuMapping.vue'
import MenuParts from './components/MenuParts.vue'
import { useInstances } from './store/instances'
import MenuModulesSearch from './components/MenuModulesSearch.vue'
import MenuEncoders from './components/MenuEncoders.vue'

const instances = useInstances()
instances.add('Input', { x: 200, y: 200 })
instances.add('Output', { x: 200, y: 400 })

const sideBar = ref<InstanceType<typeof AppSidebar>>()
</script>

<style lang="scss">
@import '@/styles/config.css';

@font-face {
  font-family: 'Vevey Positive';
  src: url('./assets/fonts/vevey-positive-webfont.woff2') format('woff2'),
    url('./assets/fonts/vevey-positive-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

body {
  background-color: var(--background-color);
}

#app {
  width: 100%;
  height: 100%;
  font-family: 'Vevey positive';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: antialiased;
}

.pane {
  &-patch {
    position: relative;
  }
}

.splitpanes__splitter {
  width: 7px;
  background-color: var(--module-shape-color);
}
</style>
