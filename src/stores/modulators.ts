import type { Modulator, ModulatorSerialized, Optional } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDevice } from './device'
import { useModulatorDefinitions } from './modulatorDefinitions'
import { useProject } from './project'

type Id = Modulator['id']

export const serializeModulator = (
  modulator: Modulator
): ModulatorSerialized => ({
  ...modulator,
  position: [modulator.position.x, modulator.position.y],
})

export const deserializeModulator = (
  serialized: ModulatorSerialized
): Modulator => ({
  ...serialized,
  label: serialized.label ?? serialized.type,
  props: serialized.props ?? {},
  position: {
    x: serialized.position?.[0] ?? 0,
    y: serialized.position?.[1] ?? 0,
  },
})

export const useModulators = defineStore('modulators', () => {
  const items = ref(
    new Map<Id, Modulator>([
      [
        1,
        {
          id: 1,
          type: 'Lfo',
          props: { shape: 1, rate: 5 },
          label: 'Lfo 1',
          position: { x: 0, y: 0 },
        },
      ],
    ])
  )

  const project = useProject()
  const device = useDevice()
  const definitions = useModulatorDefinitions()

  // Getters
  const get = (id: Id) => {
    const item = items.value.get(id)
    if (!item) {
      console.warn(`module '${id}' not found`)
      return
    }
    return item
  }

  const list = computed(() => Array.from(items.value.values()))

  // Actions
  const serialize = (): ModulatorSerialized[] =>
    Array.from(items.value.values()).map(serializeModulator)

  const deserialize = (serialized: ModulatorSerialized[]) => {
    items.value.clear()
    for (const serializedModulator of serialized) {
      const modulator = deserializeModulator(serializedModulator)
      add(modulator, false)
      // Make sure that future modulator ids won't clash with the currently
      // added modulator.
      project.nextId = Math.max(project.nextId, modulator.id + 1)
    }
  }

  const add = (
    modulator: Optional<Modulator, 'id' | 'props'>,
    updateDevice = true
  ) => {
    modulator.id ??= project.nextId++
    modulator.props ??= definitions.getDefaultProps(modulator.type)
    items.value.set(modulator.id, modulator as Modulator)

    if (updateDevice)
      device.update('/e/modulators/add', [modulator.id, modulator.type])
  }

  const clear = () => items.value.clear()

  return { items, list, get, serialize, deserialize, add, clear }
})
