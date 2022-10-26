import { parse } from 'lua-json'

export const luaToJson = (lua: string) =>
  parse(lua.startsWith('return ') ? lua : `return ${lua}`)
