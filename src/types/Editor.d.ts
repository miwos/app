export interface EditorFile {
  name: string
  content: string
  hasUnsavedChanges?: boolean
  lastSavedVersionId?: number
}
