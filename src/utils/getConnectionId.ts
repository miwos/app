export const getConnectionId = (connection: Connection) => {
  const { from, to } = connection
  return `(${from.moduleId},${from.index})-(${to.moduleId},${to.index})`
}
