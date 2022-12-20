import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useApp = defineStore('app', () => {
  const showPropFields = ref(false)
  return { showPropFields }
})
