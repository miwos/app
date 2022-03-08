import { MidiDevice, MidiDeviceType } from '@/types/Midi'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

export const useMidi = defineStore('midi', () => {
  const state = reactive({
    devices: [
      { id: 1, label: 'Midi 1', type: MidiDeviceType.Din },
      { id: 2, label: 'Nord Drum 3', type: MidiDeviceType.Din },
      { id: 3, label: 'Midi 3', type: MidiDeviceType.Usb },
      { id: 4, label: 'Midi 4', type: MidiDeviceType.Usb },
      { id: 5, label: 'Midi 5', type: MidiDeviceType.Usb },
      { id: 6, label: 'Midi 6', type: MidiDeviceType.Usb },
      { id: 7, label: 'Midi 7', type: MidiDeviceType.Usb },
      { id: 8, label: 'Midi 8', type: MidiDeviceType.Usb },
      { id: 9, label: 'Midi 9', type: MidiDeviceType.Usb },
      { id: 10, label: 'Midi 10', type: MidiDeviceType.Usb },
      { id: 11, label: 'Midi 11', type: MidiDeviceType.Usb },
      { id: 12, label: 'Midi 12', type: MidiDeviceType.Usb },
      { id: 13, label: 'Midi 13', type: MidiDeviceType.Usb },
    ] as MidiDevice[],
  })

  return { ...toRefs(state) }
})
