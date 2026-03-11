'use client';

import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { useDesignerStore } from './useDesignerStore';
import DesignerCanvas from './DesignerCanvas';
import ComponentPalette from './ComponentPalette';

interface HardwareDesignerProps {
  boardId: string;
  boardName: string;
  processor: string;
  interfaces: string[];
  onComplete: (connectionsConfig: { pins: { pin: string; component: string; description: string }[] }) => void;
}

export default function HardwareDesigner({
  boardId,
  boardName,
  processor,
  interfaces,
  onComplete,
}: HardwareDesignerProps) {
  const initBoard = useDesignerStore((s) => s.initBoard);
  const toConnectionsConfig = useDesignerStore((s) => s.toConnectionsConfig);

  useEffect(() => {
    initBoard(boardId, boardName, processor, interfaces);
  }, [boardId, boardName, processor, interfaces, initBoard]);

  const handleContinue = () => {
    const config = toConnectionsConfig();
    onComplete(config);
  };

  return (
    <div className="flex flex-col h-[600px]">
      <ReactFlowProvider>
        <div className="flex flex-1 rounded-lg border border-gray-800 overflow-hidden">
          <ComponentPalette />
          <DesignerCanvas />
        </div>
      </ReactFlowProvider>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleContinue}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
