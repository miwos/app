export const getConnectionId = (from: ConnectionPoint, to: ConnectionPoint) =>
  `(${from.moduleId},${from.index})-(${to.moduleId},${to.index})`
