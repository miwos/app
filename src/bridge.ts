import AsyncOsc from 'async-osc'
import WebSerialTransport from 'async-osc/dist/WebSerialTransport'
import { useLogs } from './store/logs'
import { ref, markRaw } from 'vue'
import { useInstances } from './store/instances'
import { MidiType } from './utils'
import { Log } from './types/Log'
import { Handle } from 'shape-compiler/src'

class Bridge {
  private osc = markRaw(new AsyncOsc(new WebSerialTransport()))
  private memoryInterval: number | undefined

  isConnected = ref(false)
  usedMemory = ref(0)

  constructor() {
    this.osc.on('/disconnect', () => {
      this.isConnected.value = false
    })

    // this.osc.on('/data/dev', (data) =>
    //   console.log(new TextDecoder().decode(data))
    // )

    this.osc.on('/log/:type', ({ args }, { type }) => {
      const [text] = args
      ;(console as any)[type]?.(text)
      useLogs().addLog(type as Log['type'], text)
    })

    this.osc.on('/raw/log/:type', async (_, { type }) => {
      const data = await this.osc.waitForRawData()
      const text = new TextDecoder().decode(data)
      ;(console as any)[type]?.(text)
      useLogs().addLog(type as Log['type'], text)
    })

    this.osc.on('/instance/prop', ({ args }) => {
      const [instanceId, propName, value] = args
      useInstances().get(instanceId).propValues[propName] = value
    })

    this.osc.on('/instance/in-out', ({ args }) => {
      // TODO: make this work for non-midi data.

      const [direction, instanceId, index] = args
      const midiMessage = args.slice(3)
      const [status] = midiMessage
      const midiType = status & 0xf0

      const isActive = midiType !== MidiType.NoteOff
      const { activeHandleIds } = useInstances().get(instanceId)
      const handleId = `midi-${direction}-${index}` as Handle['id']
      const inoutHandleId = `midi-inout-${index}` as Handle['id']

      if (isActive) {
        activeHandleIds.add(handleId)
        activeHandleIds.add(inoutHandleId)
      } else {
        activeHandleIds.delete(handleId)
        activeHandleIds.delete(inoutHandleId)
      }
    })
  }

  async connect() {
    await this.osc.connect()
    this.osc.sendMessage('/bridge/connect')
    this.isConnected.value = true

    this.memoryInterval = window.setInterval(async () => {
      this.usedMemory.value = parseInt(
        await this.osc.sendRequest('/info/memory-usage')
      )
    }, 1000)
  }

  async init() {
    try {
      await this.osc.sendRequest('/lua/run-file', 'lua/init.lua')
    } catch (error) {
      this.logError(`Couldn't initialize device (${(error as Error)?.message})`)
    }
  }

  sendProp(moduleId: number, name: string, value: number) {
    this.osc.sendMessage('patch/prop', [moduleId, name, value])
  }

  async updatePatch(name: string, patch: string) {
    try {
      const dirName = 'lua/patches'
      const fileName = `${name}.lua`
      const data = new TextEncoder().encode(patch)
      await this.osc.sendRawRequest('/write-file', [dirName, fileName], data)
      await this.osc.sendRequest('/patch/update', name)
    } catch (error) {
      this.logError(
        `Couldn't update patch '${name}' (${(error as Error).message})`
      )
    }
  }

  private logError(message: string) {
    console.error(message)
    useLogs().addLog('error', message)
  }

  async close() {
    await this.osc.close()
    clearInterval(this.memoryInterval)
    this.isConnected.value = false
  }
}

let bridge: Bridge
export const useBridge = () => (bridge ??= new Bridge())
