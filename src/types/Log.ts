export interface Log {
  type: 'info' | 'warn' | 'error' | 'success' | 'print'
  text: string
}
