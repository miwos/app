import WebSerialTransport from 'async-osc/dist/WebSerialTransport'
import LuaOnArduino from 'lua-on-arduino'
import { markRaw } from 'vue'

const debug = false

let loa: LuaOnArduino
export const useLoa = () =>
  (loa ??= markRaw(new LuaOnArduino(new WebSerialTransport(), { debug })))
