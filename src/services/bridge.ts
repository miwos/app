import AsyncOsc from 'async-osc'
import WebSerialTransport from 'async-osc/dist/WebSerialTransport'
import { useLogs } from '@/store/logs'
import { ref, markRaw } from 'vue'
import { useInstances } from '@/store/instances'
import { MidiType, nameWithoutExt } from '@/utils'
import { Log } from '@/types/Log'
import { InputOutput } from 'shape-compiler'
import { useMapping } from '@/store/mapping'
import { Module } from '@/types/Module'
import LuaOnArduino from 'lua-on-arduino'
import { useModules } from '@/store/modules'

enum Signal {
  Midi,
  Trigger,
}
enum Direction {
  In,
  Out,
}

class Bridge {
  public osc = markRaw(new AsyncOsc(new WebSerialTransport()))
  public loa = markRaw(new LuaOnArduino(this.osc, { debug: false }))
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

    this.osc.on('/encoder/value', ({ args }) => {
      const [id, value] = args
      useMapping().currentPage.encoders[id].value = value
    })

    this.osc.on('/instance/prop', ({ args }) => {
      const [instanceId, propName, value] = args
      useInstances().items[instanceId].propValues[propName] = value
    })

    this.osc.on('/instance/update', async ({ args }) => {
      const [id] = args
      const instance = useInstances().items[id]
      if (instance) {
        instance.isUpdating = false
      } else {
        console.warn(`Instance #${id} doesn't exist`)
      }
    })

    this.osc.on('/bridge/active-outputs', ({ args }) => {
      for (const instance of useInstances().list) {
        instance.activeInputOutputIds.clear()
      }

      const pairs = args[0].split(',')
      for (const pair of pairs) {
        const [instanceId, index] = pair.split('-')
        const id = `midi-out-${index}` as InputOutput['id']
        const instance = useInstances().get(instanceId)
        instance.activeInputOutputIds.add(id)
      }
    })

    this.osc.on('/instance/in-out', ({ args }) => {
      // Todo show active trigger input/outputs
      console.log('in out')

      const [signal, direction, instanceId, index] = args
      const directionName = Direction[direction].toLowerCase()

      if (signal === Signal.Midi) {
        const midiMessage = args.slice(4)
        const [status] = midiMessage
        const midiType = status & 0xf0

        const isActive = midiType !== MidiType.NoteOff
        const { activeInputOutputIds } = useInstances().get(instanceId)
        const id = `midi-${directionName}-${index}` as InputOutput['id']
        const inoutId = `midi-inout-${index}` as InputOutput['id']

        if (isActive) {
          activeInputOutputIds.add(id)
          activeInputOutputIds.add(inoutId)
        } else {
          activeInputOutputIds.delete(id)
          activeInputOutputIds.delete(inoutId)
        }
      }
    })

    this.osc.on('/mapping/page', ({ args }) => {
      const [pageIndex] = args
      useMapping().currentPageIndex = pageIndex - 1
    })
  }

  async connect() {
    await this.osc.connect()
    this.osc.sendMessage('/bridge/connect')
    this.isConnected.value = true

    useModules().loadFromDevice()

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

  sendProp(instanceId: number, name: string, value: number) {
    this.osc.sendMessage('patch/prop', [instanceId, name, value])
  }

  selectPage(index: number) {
    this.osc.sendMessage('mapping/page', index)
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

  async getModuleInfo(moduleId: Module['id']) {
    const modules = await this.loa.readDirectory('lua/modules')
    for (const module of modules) {
      const moduleId = nameWithoutExt(module)
      const response = await this.osc.sendRequest('/module/info', [moduleId])
      console.log(JSON.parse(response))
    }
    // const response = await this.osc.sendRequest('/module/info', [moduleId])
    // return JSON.parse(response)
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
