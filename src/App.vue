<template>
  <Splitpanes @resize="sideBar?.resize()">
    <Pane class="pane-patch">
      <AppPatch />
      <MenuMain />
      <MenuEncodersPages />
      <MenuEncoders />
      <MenuModulesSearch />
      <MenuParts />
    </Pane>
    <Pane v-if="editor.enabled">
      <AppSidebar ref="sideBar" />
    </Pane>
  </Splitpanes>
</template>

<script setup lang="ts">
import { onKeyDown, useMagicKeys } from '@vueuse/core'
// @ts-ignore
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { ref, watch } from 'vue'
import AppPatch from './components/AppPatch.vue'
import AppSidebar from './components/AppSidebar.vue'
import MenuEncoders from './components/MenuEncoders.vue'
import MenuMain from './components/MenuMain.vue'
import MenuEncodersPages from './components/MenuEncodersPages.vue'
import MenuModulesSearch from './components/MenuModulesSearch.vue'
import MenuParts from './components/MenuParts.vue'
import { useApp } from './stores/app'
import { useEditor } from './stores/editor'
import { useMidi } from './stores/midi'

useMidi()
const app = useApp()
const editor = useEditor()

onKeyDown('Alt', (e) => e.ctrlKey && app.toggleViewMode())

const sideBar = ref<InstanceType<typeof AppSidebar>>()
</script>

<style lang="scss">
@use '@/styles/config.scss';

@mixin glass {
  background-color: var(--glass-color);
  backdrop-filter: blur(20px);
}

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
  z-index: 1;

  .splitpanes--horizontal > & {
    height: 7px;
    margin: -3.5px 0;
  }

  .splitpanes--vertical > & {
    width: 7px;
    margin: 0 -3.5px;
  }

  &:hover {
    background-color: var(--module-shape-color-lighter);
  }
}
</style>
