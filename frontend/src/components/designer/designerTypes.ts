import type { Node, Edge } from '@xyflow/react';

// Pin type for a hardware component (sensor, display, etc.)
export interface ComponentPin {
  id: string;
  label: string;
  type: 'digital' | 'analog' | 'i2c' | 'spi' | 'uart' | 'pwm' | 'power' | 'ground' | 'data';
  side: 'left' | 'right';
  required: boolean;
}

// Catalog entry for a hardware component
export interface HardwareComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  icon: string; // lucide icon name
  pins: ComponentPin[];
}

export type ComponentCategory =
  | 'sensor'
  | 'display'
  | 'actuator'
  | 'communication'
  | 'storage'
  | 'audio'
  | 'motor'
  | 'timing'
  | 'misc';

// Data stored inside a ReactFlow node for a placed component
export interface PlacedComponentData {
  componentId: string;
  label: string;
  category: ComponentCategory;
  icon: string;
  pins: ComponentPin[];
  [key: string]: unknown;
}

// GPIO pin on a board
export interface BoardGpioPin {
  id: string;
  label: string;
  altFunction?: string; // e.g. "SDA", "SCL", "MOSI"
  capabilities: string[]; // e.g. ["digital", "i2c", "pwm"]
  side: 'left' | 'right';
}

// Data stored inside a ReactFlow node for the board
export interface PlacedBoardData {
  boardId: string;
  boardName: string;
  processor: string;
  pins: BoardGpioPin[];
  [key: string]: unknown;
}

// Board pin map definition
export interface BoardPinMap {
  id: string;
  pins: BoardGpioPin[];
}

// Custom node types
export type ComponentNodeType = Node<PlacedComponentData, 'component'>;
export type BoardNodeType = Node<PlacedBoardData, 'board'>;
export type DesignerNode = ComponentNodeType | BoardNodeType;
export type DesignerEdge = Edge;
