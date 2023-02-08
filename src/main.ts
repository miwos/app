import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Previewer from 'virtual:vue-component-preview'

import './main.scss'

const app = createApp(App)

// I tried to avoid a monorepo, but still wanted to get HMR for miwos modules
// development. So as a dirty workaround we're assuming the modules repo is
// in the same parent folder.
// if (import.meta.env.DEV) {
//   // @ts-ignore
//   const modules = await import('../../modules/src/index.ts')
//   app.use(modules.default)
// }

app.use(createPinia())
app.use(router)
app.use(Previewer)

app.mount('#app')
