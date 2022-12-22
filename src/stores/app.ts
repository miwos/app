import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useApp = defineStore('app', () => {
  const showPropFields = ref(false)
  const isMapping = ref(false)
  return { showPropFields, isMapping }
})
