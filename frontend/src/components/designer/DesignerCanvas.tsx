'use client';

import { useCallback, useRef, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type ReactFlowInstance,
} from '@xyflow/react';
import { useDesignerStore } from './useDesignerStore';
import ComponentNode from './ComponentNode';
import BoardNode from './BoardNode';
import WireEdge from './WireEdge';

const nodeTypes = { component: ComponentNode, board: BoardNode };
const edgeTypes = { wire: WireEdge };

export default function DesignerCanvas() {
  const nodes = useDesignerStore((s) => s.nodes);
  const edges = useDesignerStore((s) => s.edges);
  const onNodesChange = useDesignerStore((s) => s.onNodesChange);
  const onEdgesChange = useDesignerStore((s) => s.onEdgesChange);
  const onConnect = useDesignerStore((s) => s.onConnect);
  const addComponent = useDesignerStore((s) => s.addComponent);
  const rfInstance = useRef<ReactFlowInstance | null>(null);

  const defaultEdgeOptions = useMemo(() => ({
    type: 'wire' as const,
  }), []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const componentId = e.dataTransfer.getData('application/designer-component');
      if (!componentId || !rfInstance.current) return;

      const bounds = (e.target as HTMLElement).closest('.react-flow')?.getBoundingClientRect();
      if (!bounds) return;

      const position = rfInstance.current.screenToFlowPosition({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      addComponent(componentId, position);
    },
    [addComponent]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => { rfInstance.current = instance; }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        deleteKeyCode={['Backspace', 'Delete']}
        snapToGrid
        snapGrid={[10, 10]}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#222" />
        <Controls showInteractive={false} />
        <MiniMap
          nodeStrokeWidth={3}
          pannable
          zoomable
          nodeColor={(n) => {
            if (n.type === 'board') return '#d97706';
            return '#555';
          }}
        />
      </ReactFlow>
    </div>
  );
}
