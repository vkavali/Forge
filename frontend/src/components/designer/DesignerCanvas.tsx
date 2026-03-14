'use client'

import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react'
import type { Connection } from '@xyflow/react'
import { useDesignerStore } from './useDesignerStore'
import ComponentNode from './ComponentNode'
import BoardNode from './BoardNode'
import WireEdge from './WireEdge'

const nodeTypes = { component: ComponentNode, board: BoardNode }
const edgeTypes = { wire: WireEdge }

export default function DesignerCanvas() {
  const nodes = useDesignerStore(s => s.nodes)
  const edges = useDesignerStore(s => s.edges)
  const onNodesChange = useDesignerStore(s => s.onNodesChange)
  const onEdgesChange = useDesignerStore(s => s.onEdgesChange)
  const onConnect = useDesignerStore(s => s.onConnect)
  const addComponentNode = useDesignerStore(s => s.addComponentNode)

  const { screenToFlowPosition } = useReactFlow()

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const componentId = e.dataTransfer.getData('application/shipboard-component')
    if (!componentId) return
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    addComponentNode(componentId, position)
  }, [screenToFlowPosition, addComponentNode])

  const handleConnect = useCallback((connection: Connection) => {
    onConnect(connection)
  }, [onConnect])

  return (
    <div className="w-full h-full bg-zinc-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionRadius={30}
        snapToGrid
        snapGrid={[10, 10]}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        deleteKeyCode="Delete"
        className="bg-zinc-950"
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#3f3f46"
          gap={20}
          size={1}
        />
        <Controls
          className="!bg-zinc-900 !border-zinc-700 !rounded-xl"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-zinc-900 !border-zinc-700 !rounded-xl"
          nodeColor={(node) => node.type === 'board' ? '#f59e0b' : '#52525b'}
          maskColor="rgba(0,0,0,0.6)"
        />
      </ReactFlow>
    </div>
  )
}
