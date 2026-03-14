'use client'

import { useEffect } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import ComponentPalette from './ComponentPalette'
import DesignerCanvas from './DesignerCanvas'
import { useDesignerStore } from './useDesignerStore'
import { BOARD_PIN_MAPS, getGenericPins } from './componentCatalog'
import type { ConnectionsConfig } from './designerTypes'

interface HardwareDesignerProps {
  boardId: string
  boardName: string
  processor: string
  interfaces: string[]
  onComplete: (config: ConnectionsConfig) => void
}

export default function HardwareDesigner({
  boardId, boardName, processor,
  interfaces, onComplete,
}: HardwareDesignerProps) {
  const initBoard = useDesignerStore(s => s.initBoard)
  const toConnectionsConfig = useDesignerStore(s => s.toConnectionsConfig)
  const edges = useDesignerStore(s => s.edges)
  const nodes = useDesignerStore(s => s.nodes)
  const reset = useDesignerStore(s => s.reset)

  useEffect(() => {
    reset()
    // Try exact match, then common aliases
    const pins = BOARD_PIN_MAPS[boardId]
      || BOARD_PIN_MAPS[boardId.replace(/_/g, '')]
      || getGenericPins(interfaces)
    initBoard(boardId, boardName, processor, pins)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId])

  const componentCount = nodes.filter(n => n.type === 'component').length
  const connectionCount = edges.length
  const hasConnections = connectionCount > 0

  const handleContinue = () => {
    const config = toConnectionsConfig()
    onComplete(config)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-[500px] rounded-xl border border-zinc-800 overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2
                      bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span>
            <span className="text-zinc-300 font-medium">{componentCount}</span> components
          </span>
          <span>
            <span className="text-zinc-300 font-medium">{connectionCount}</span> connections
          </span>
        </div>

        <div className="flex items-center gap-3">
          {hasConnections ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ready to generate
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-zinc-600">
              <AlertCircle className="w-3.5 h-3.5" />
              Draw wires from component pins to board GPIO
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={!hasConnections}
            className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all
                       bg-amber-500 hover:bg-amber-400 text-zinc-900
                       disabled:bg-zinc-800 disabled:text-zinc-600
                       disabled:cursor-not-allowed"
          >
            Confirm Connections
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-60 shrink-0 overflow-hidden">
          <ComponentPalette />
        </div>
        <div className="flex-1 overflow-hidden">
          <ReactFlowProvider>
            <DesignerCanvas />
          </ReactFlowProvider>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="px-4 py-2 bg-zinc-900/50 border-t border-zinc-800 shrink-0">
        <p className="text-[10px] text-zinc-700 text-center">
          Click info icon on components for education tips &bull; Delete key removes selected nodes &bull; Scroll to zoom
        </p>
      </div>
    </div>
  )
}
