import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginRaw from 'vite-plugin-raw'
import path from 'path'

export default defineConfig({
  build: { assetsInlineLimit: 0 },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  plugins: [vue(), vitePluginRaw({ match: /\.svg$/ })],
})
