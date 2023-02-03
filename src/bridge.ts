import { Bridge } from '@miwos/bridge'
import { WebSerialTransport } from '@miwos/bridge/dist/WebSerialTransport.js'
import { markRaw } from 'vue'

let bridge: Bridge | undefined
const debug = false
export const useBridge = () =>
  (bridge ??= markRaw(new Bridge(new WebSerialTransport(), { debug })))
