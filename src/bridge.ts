import AsyncOsc from 'async-osc'
import WebSerialTransport from 'async-osc/dist/WebSerialTransport'
import { LogType, useLogs } from './store/logs'
import { ref } from 'vue'

class Bridge {
  private osc = new AsyncOsc(new WebSerialTransport())

  isConnected = ref(false)

  constructor() {
    this.osc.on('/disconnect', () => {
      this.isConnected.value = false
    })

    this.osc.on('/data/dev', (data) =>
      console.log(new TextDecoder().decode(data))
    )

    this.osc.on('/log/:type', (message, params) =>
      useLogs().addLog(params.type as LogType, message.args[0])
    )

    this.osc.on(
      '/raw/log/:type',
      async (_message: Object, params: Record<string, any>) => {
        const data = await this.osc.waitForRawData()
        useLogs().addLog(params.type as LogType, new TextDecoder().decode(data))
      }
    )
  }

  async connect() {
    await this.osc.connect()
    this.isConnected.value = true
  }

  async init() {
    try {
      await this.osc.sendRequest('/lua/run-file', 'lua/init.lua')
    } catch (error) {
      this.logError(`Couldn't initialize device (${(error as Error)?.message})`)
    }
  }

  async updatePatch(name: string, patch: string) {
    try {
      const fileName = `lua/patches/${name}.lua`
      const data = new TextEncoder().encode(patch)
      await this.osc.sendRawRequest('/write-file', fileName, data)
      await this.osc.sendRequest('/update-patch', name)
    } catch (error) {
      this.logError(
        `Couldn't update patch '${name}' (${(error as Error).message})`
      )
    }
  }

  private logError(message: string) {
    useLogs().addLog('error', message)
  }

  async close() {
    await this.osc.close()
    this.isConnected.value = false
  }
}

let bridge: Bridge
export const useBridge = () => (bridge ??= new Bridge())
