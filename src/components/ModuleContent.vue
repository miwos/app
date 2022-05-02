<template>
  <component
    v-if="module?.component"
    :is="getComponent(module.id)"
    v-bind="propValues"
    :props="props"
  />
</template>

<script setup lang="ts">
import { Module } from '@/types/Module'
import { ModuleInstance } from '@/types/ModuleInstance'
import { computed, ComputedRef, inject } from 'vue'
import type { Component } from 'vue'
import Delay from '@/modules/Delay.vue'
import Input from '@/modules/Input.vue'
import Output from '@/modules/Output.vue'
import Chords from '@/modules/Chords.vue'
import PatternListen from '@/modules/PatternListen.vue'
import Metronome from '@/modules/Metronome.vue'

const module = inject<ComputedRef<Module>>('module')!
const instance = inject<ComputedRef<ModuleInstance>>('instance')!

const props = computed(() =>
  Object.fromEntries(instance.value?.props.entries())
)

const propValues = computed(() =>
  Object.fromEntries(
    Object.entries(props.value).map(([name, v]) => [name, v.value])
  )
)

const componentsLookup: Record<string, Component> = {
  Delay,
  Input,
  Output,
  Chords,
  PatternListen,
  Metronome,
}

const getComponent = (id: string) => componentsLookup[id]
</script>
