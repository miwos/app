export enum MidiDeviceType {
  Din,
  Usb,
}

export interface MidiDevice {
  id: number
  type: MidiDeviceType
  label: string
}
