import { useInstances } from '@/stores/instances'
import { useLogs } from '@/stores/logs'
import { useMapping } from '@/stores/mapping'
import { useModules } from '@/stores/modules'
import { usePatch } from '@/stores/patch'
import { Log } from '@/types/Log'
import { MidiType } from '@/utils'
import { InputOutput } from 'shape-compiler'
import { ref } from 'vue'
import { useLoa } from './loa'

class Bridge {
  private loa = useLoa()
  private memoryInterval: number | undefined

  isConnected = ref(false)
  usedMemory = ref(0)

  constructor() {
    const { loa } = this

    loa.on('/log/:type', ({ args }, params) => {
      useLogs().add(params.type as Log['type'], args[0])
    })

    loa.on('/disconnect', () => {
      this.isConnected.value = false
    })

    loa.on('/encoder/value', ({ args }) => {
      const [id, value] = args
      useMapping().currentPage.encoders[id].value = value
    })

    loa.on('/instance/prop', ({ args }) => {
      const [id, propName, value] = args
      const instance = useInstances().items[id]
      if (instance) {
        instance.props[propName] = value
      } else {
        console.warn(`Instance #${id} doesn't exist`)
      }
    })

    loa.on('/instance/update', async ({ args }) => {
      const [id] = args
      const instance = useInstances().items[id]
      if (instance) {
        instance.isUpdating = false
      } else {
        console.warn(`Instance #${id} doesn't exist`)
      }
    })

    loa.on('/bridge/active-outputs', ({ args }) => {
      for (const instance of useInstances().list) {
        instance.activeInputOutputIds.clear()
      }

      // The active outputs were encoded as a string in the following format,
      // where id is the module's id and index the output's index:
      // `id-index, id-index, ...`
      const [activeOutputsEncoded] = args
      if (!activeOutputsEncoded) return

      const pairs = activeOutputsEncoded.split(',')
      for (const pair of pairs) {
        const [instanceId, index] = pair.split('-')
        const id = `midi-out-${index}` as InputOutput['id']
        const instance = useInstances().get(instanceId)
        instance.activeInputOutputIds.add(id)
      }
    })

    loa.on('/instance/in-out', ({ args }) => {
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

    loa.on('/mapping/page', ({ args }) => {
      const [pageIndex] = args
      useMapping().currentPageIndex = pageIndex - 1
    })
  }

  async connect() {
    await this.loa.connect()
    this.loa.sendMessage('/bridge/connect')
    this.isConnected.value = true

    await useModules().loadFromDevice()
    usePatch().load()

    this.memoryInterval = window.setInterval(async () => {
      this.usedMemory.value = parseInt(
        await this.loa.sendRequest('/info/memory-usage')
      )
    }, 1000)
  }

  async init() {
    try {
      await this.loa.sendRequest('/lua/run-file', 'lua/init.lua')
    } catch (error) {
      this.logError(`Couldn't initialize device (${(error as Error)?.message})`)
    }
  }

  sendProp(instanceId: number, name: string, value: number) {
    this.loa.sendMessage('patch/prop', [instanceId, name, value])
  }

  selectPage(index: number) {
    this.loa.sendMessage('mapping/page', index)
  }

  private logError(message: string) {
    console.error(message)
    useLogs().addLog('error', message)
  }

  async close() {
    await this.loa.close()
    clearInterval(this.memoryInterval)
    this.isConnected.value = false
  }
}

let bridge: Bridge
export const useBridge = () => (bridge ??= new Bridge())
