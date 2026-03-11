export type PinType =
  | 'digital'
  | 'analog'
  | 'i2c'
  | 'spi'
  | 'uart'
  | 'pwm'
  | 'power'
  | 'ground'

export type PinSide = 'left' | 'right' | 'top' | 'bottom'

export type ComponentCategory =
  | 'sensor'
  | 'display'
  | 'actuator'
  | 'communication'
  | 'storage'
  | 'audio'
  | 'motor'
  | 'timing'
  | 'misc'

export interface ComponentPin {
  id: string
  label: string
  type: PinType
  side: PinSide
  required: boolean
}

export interface HardwareComponent {
  id: string
  label: string
  displayName: string
  category: ComponentCategory
  icon: string
  description: string
  educationTip: string
  estimatedCostUsd: number
  whereToBuy: string[]
  voltageWarning?: string
  pins: ComponentPin[]
}

export interface BoardGpioPin {
  id: string
  label: string
  type: PinType
  side: 'left' | 'right'
  i2cBus?: boolean
}

export interface PlacedComponentData {
  component: HardwareComponent
  [key: string]: unknown
}

export interface PlacedBoardData {
  boardId: string
  boardName: string
  processor: string
  pins: BoardGpioPin[]
  [key: string]: unknown
}

export interface PinMapping {
  pin: string
  component: string
  description: string
}

export interface ConnectionsConfig {
  pins: PinMapping[]
}
