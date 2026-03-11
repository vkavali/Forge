import { create } from 'zustand';
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type { PlacedComponentData, PlacedBoardData, BoardGpioPin } from './designerTypes';
import { COMPONENT_CATALOG, BOARD_PIN_MAPS, buildGenericPins } from './componentCatalog';

interface DesignerState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  initBoard: (boardId: string, boardName: string, processor: string, interfaces: string[]) => void;
  addComponent: (componentId: string, position: { x: number; y: number }) => void;
  removeNode: (nodeId: string) => void;
  removeEdge: (edgeId: string) => void;
  toConnectionsConfig: () => { pins: { pin: string; component: string; description: string }[] };
}

let nodeIdCounter = 0;
function nextNodeId() {
  return `node_${++nodeIdCounter}`;
}

let edgeIdCounter = 0;
function nextEdgeId() {
  return `edge_${++edgeIdCounter}`;
}

export const useDesignerStore = create<DesignerState>((set, get) => ({
  nodes: [],
  edges: [],

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection: Connection) => {
    const { edges, nodes } = get();

    // Validate: source must be a component node, target must be the board node
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    if (!sourceNode || !targetNode) return;
    if (sourceNode.type !== 'component' || targetNode.type !== 'board') return;

    // Check if source handle is already connected (1 wire per component pin)
    const sourceAlreadyConnected = edges.some(
      (e) => e.source === connection.source && e.sourceHandle === connection.sourceHandle
    );
    if (sourceAlreadyConnected) return;

    // Check if target handle is already connected (1 wire per GPIO, except I2C)
    const targetPin = (targetNode.data as PlacedBoardData).pins.find(
      (p: BoardGpioPin) => p.id === connection.targetHandle
    );
    const isI2cBus = targetPin && targetPin.capabilities.includes('i2c') &&
      (targetPin.altFunction === 'SDA' || targetPin.altFunction === 'SCL');
    if (!isI2cBus) {
      const targetAlreadyConnected = edges.some(
        (e) => e.target === connection.target && e.targetHandle === connection.targetHandle
      );
      if (targetAlreadyConnected) return;
    }

    // Determine edge style based on pin type
    const componentData = sourceNode.data as PlacedComponentData;
    const pin = componentData.pins.find((p) => p.id === connection.sourceHandle);
    const isPowerOrGround = pin && (pin.type === 'power' || pin.type === 'ground');

    const newEdge: Edge = {
      id: nextEdgeId(),
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'wire',
      data: { isPowerOrGround },
    };

    set({ edges: [...edges, newEdge] });
  },

  initBoard: (boardId, boardName, processor, interfaces) => {
    nodeIdCounter = 0;
    edgeIdCounter = 0;
    const boardPinMap = BOARD_PIN_MAPS.find((b) => b.id === boardId);
    const pins = boardPinMap ? boardPinMap.pins : buildGenericPins(interfaces);

    const boardNode: Node<PlacedBoardData> = {
      id: 'board',
      type: 'board',
      position: { x: 500, y: 0 },
      data: { boardId, boardName, processor, pins },
      draggable: true,
    };

    set({ nodes: [boardNode], edges: [] });
  },

  addComponent: (componentId, position) => {
    const comp = COMPONENT_CATALOG.find((c) => c.id === componentId);
    if (!comp) return;

    const nodeId = nextNodeId();
    const newNode: Node<PlacedComponentData> = {
      id: nodeId,
      type: 'component',
      position,
      data: {
        componentId: comp.id,
        label: comp.name,
        category: comp.category,
        icon: comp.icon,
        pins: comp.pins,
      },
    };

    set({ nodes: [...get().nodes, newNode] });
  },

  removeNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    });
  },

  removeEdge: (edgeId) => {
    set({ edges: get().edges.filter((e) => e.id !== edgeId) });
  },

  toConnectionsConfig: () => {
    const { nodes, edges } = get();
    const boardNode = nodes.find((n) => n.type === 'board');
    if (!boardNode) return { pins: [] };

    const boardData = boardNode.data as PlacedBoardData;
    const pins: { pin: string; component: string; description: string }[] = [];

    for (const edge of edges) {
      const compNode = nodes.find((n) => n.id === edge.source);
      if (!compNode || compNode.type !== 'component') continue;
      const compData = compNode.data as PlacedComponentData;

      // Find the board pin label for this edge
      const boardPin = boardData.pins.find((p) => p.id === edge.targetHandle);
      if (!boardPin) continue;

      // Find the component pin for description
      const compPin = compData.pins.find((p) => p.id === edge.sourceHandle);

      // Skip power/ground pins — they don't need mapping in the config
      if (compPin && (compPin.type === 'power' || compPin.type === 'ground')) continue;

      pins.push({
        pin: boardPin.label,
        component: compData.label,
        description: `${compData.label} ${compPin?.label || edge.sourceHandle} pin`,
      });
    }

    return { pins };
  },
}));
