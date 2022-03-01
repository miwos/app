import WebSerialTransport from 'async-osc/dist/WebSerialTransport'
import LuaOnArduino from 'lua-on-arduino'
import { markRaw } from 'vue'

let loa: LuaOnArduino
export const useLoa = () =>
  (loa ??= markRaw(new LuaOnArduino(new WebSerialTransport())))
