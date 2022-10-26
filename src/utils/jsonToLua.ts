import { format } from 'lua-json'

export const jsonToLua = (json: any) => format(json)
