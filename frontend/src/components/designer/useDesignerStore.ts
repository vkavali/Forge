import { create } from 'zustand'
import {
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'
import type { ConnectionsConfig, PlacedComponentData, PlacedBoardData, BoardGpioPin } from './designerTypes'
import { COMPONENT_CATALOG } from './componentCatalog'

interface DesignerStore {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => boolean
  addComponentNode: (componentId: string, position: { x: number; y: number }) => void
  initBoard: (boardId: string, boardName: string, processor: string, pins: BoardGpioPin[]) => void
  deleteNode: (nodeId: string) => void
  deleteEdge: (edgeId: string) => void
  toConnectionsConfig: () => ConnectionsConfig
  reset: () => void
}

export const useDesignerStore = create<DesignerStore>((set, get) => ({
  nodes: [],
  edges: [],

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) => {
    const { edges, nodes } = get()

    // Rule 1: Must connect component (source) → board (target)
    const sourceNode = nodes.find(n => n.id === connection.source)
    const targetNode = nodes.find(n => n.id === connection.target)
    if (sourceNode?.type !== 'component' || targetNode?.type !== 'board') return false

    // Rule 2: Board pin — max 1 wire (unless I2C bus)
    const targetPin = (targetNode.data as PlacedBoardData).pins
      ?.find((p: BoardGpioPin) => p.id === connection.targetHandle)
    const isI2cBus = targetPin?.i2cBus === true
    if (!isI2cBus) {
      const alreadyConnected = edges.some(
        e => e.target === connection.target && e.targetHandle === connection.targetHandle
      )
      if (alreadyConnected) return false
    }

    // Rule 3: Source pin — max 1 wire
    const sourceAlreadyUsed = edges.some(
      e => e.source === connection.source && e.sourceHandle === connection.sourceHandle
    )
    if (sourceAlreadyUsed) return false

    // Determine wire color from pin type
    const compData = sourceNode.data as PlacedComponentData
    const sourcePin = compData.component.pins.find(p => p.id === connection.sourceHandle)
    const isPowerOrGround = sourcePin?.type === 'power' || sourcePin?.type === 'ground'

    set((state) => ({
      edges: addEdge({
        ...connection,
        type: 'wire',
        animated: false,
        style: { stroke: isPowerOrGround ? '#71717a' : '#f59e0b', strokeWidth: 2 },
        data: { pinType: sourcePin?.type },
      }, state.edges),
    }))
    return true
  },

  initBoard: (boardId, boardName, processor, pins) => {
    const boardNode: Node = {
      id: 'board',
      type: 'board',
      position: { x: 300, y: 80 },
      draggable: true,
      data: { boardId, boardName, processor, pins } satisfies PlacedBoardData,
    }
    set({ nodes: [boardNode], edges: [] })
  },

  addComponentNode: (componentId, position) => {
    const component = COMPONENT_CATALOG.find(c => c.id === componentId)
    if (!component) return

    const nodeId = `comp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const newNode: Node = {
      id: nodeId,
      type: 'component',
      position,
      data: { component } satisfies PlacedComponentData,
    }
    set((state) => ({ nodes: [...state.nodes, newNode] }))
  },

  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter(n => n.id !== nodeId),
      edges: state.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
    }))
  },

  deleteEdge: (edgeId) => {
    set((state) => ({ edges: state.edges.filter(e => e.id !== edgeId) }))
  },

  toConnectionsConfig: (): ConnectionsConfig => {
    const { nodes, edges } = get()
    const boardNode = nodes.find(n => n.id === 'board')
    const boardData = boardNode?.data as PlacedBoardData | undefined

    const pins = edges
      .filter(e => e.target === 'board')
      .map(e => {
        const componentNode = nodes.find(n => n.id === e.source)
        const compData = componentNode?.data as PlacedComponentData | undefined
        const boardPin = boardData?.pins.find((p: BoardGpioPin) => p.id === e.targetHandle)
        const compPin = compData?.component.pins.find(p => p.id === e.sourceHandle)

        if (!compData || !boardPin || !compPin) return null
        // Skip power/ground pins from output
        if (compPin.type === 'power' || compPin.type === 'ground') return null

        return {
          pin: boardPin.id,
          component: compData.component.label,
          description: `${compData.component.displayName} ${compPin.label} pin`,
        }
      })
      .filter(Boolean) as ConnectionsConfig['pins']

    return { pins }
  },

  reset: () => set({ nodes: [], edges: [] }),
}))
