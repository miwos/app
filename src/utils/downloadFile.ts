export const downloadFile = (name: string, content: string) => {
  const file = new Blob([content], { type: 'text' })
  window.open(URL.createObjectURL(file))
}
