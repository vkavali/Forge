'use client'

import { memo, useState } from 'react'
import { getSmoothStepPath, EdgeLabelRenderer } from '@xyflow/react'
import type { EdgeProps } from '@xyflow/react'
import { X } from 'lucide-react'
import { useDesignerStore } from './useDesignerStore'

function WireEdgeComponent({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, style,
}: EdgeProps) {
  const [hovered, setHovered] = useState(false)
  const deleteEdge = useDesignerStore(s => s.deleteEdge)

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 8,
  })

  const strokeColor = (style?.stroke as string) || '#f59e0b'

  return (
    <>
      {/* Invisible wider hit area */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={12}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: 'pointer' }}
      />
      {/* Visible wire */}
      <path
        d={edgePath}
        fill="none"
        stroke={hovered ? '#fbbf24' : strokeColor}
        strokeWidth={hovered ? 2.5 : 2}
        strokeLinecap="round"
        style={{ transition: 'stroke 0.15s, stroke-width 0.15s', pointerEvents: 'none' }}
      />

      {/* Delete button on hover */}
      {hovered && (
        <EdgeLabelRenderer>
          <div
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
            className="absolute nodrag nopan"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <button
              onClick={() => deleteEdge(id)}
              className="flex items-center justify-center w-4 h-4 rounded-full
                         bg-zinc-800 border border-zinc-600 hover:bg-red-900
                         hover:border-red-500 transition-colors"
            >
              <X className="w-2.5 h-2.5 text-zinc-400 hover:text-red-400" />
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

export default memo(WireEdgeComponent)
