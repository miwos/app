import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { Bridge } from '@miwos/bridge'
import { WebSerialTransport } from '@miwos/bridge/dist/WebSerialTransport.js'

export const useDevice = defineStore('device', () => {
	const state = reactive({
		isConnected: false,
	})

	const bridge = new Bridge(new WebSerialTransport())
	bridge.on('/close', () => (state.isConnected = false))

	const open = async () => {
		await bridge.open({ baudRate: 9600 })
		state.isConnected = true
	}

	const close = async () => {
		await bridge.close()
		state.isConnected = false
	}

	return { open, close, ...toRefs(state) }
})
