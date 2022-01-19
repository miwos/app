export type Mapping = MappingPage[]

export type MappingEncoder = {
  id: number
  instanceId: number
  propName: string
}

export interface MappingPage {
  encoders: Record<MappingEncoder['id'], MappingEncoder>
}
