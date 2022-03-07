export interface Log {
  type: 'info' | 'warn' | 'error' | 'success' | 'print' | 'dump'
  text: string
}
