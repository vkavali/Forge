'use client';

import { memo, useState } from 'react';
import { getSmoothStepPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { useDesignerStore } from './useDesignerStore';

function WireEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const removeEdge = useDesignerStore((s) => s.removeEdge);
  const [hovered, setHovered] = useState(false);
  const isPowerOrGround = data?.isPowerOrGround;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 12,
  });

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Invisible wider path for easier hover */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        style={{ cursor: 'pointer' }}
      />
      {/* Visible wire */}
      <path
        d={edgePath}
        fill="none"
        stroke={hovered ? '#ef4444' : isPowerOrGround ? '#555' : '#d97706'}
        strokeWidth={hovered ? 3 : 2}
        style={{ transition: 'stroke 0.15s, stroke-width 0.15s' }}
      />
      {/* Delete button on hover */}
      {hovered && (
        <g
          transform={`translate(${labelX}, ${labelY})`}
          onClick={() => removeEdge(id)}
          style={{ cursor: 'pointer' }}
        >
          <circle r="8" fill="#1a1a1a" stroke="#ef4444" strokeWidth="1.5" />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill="#ef4444"
            fontSize="11"
            fontWeight="bold"
          >
            x
          </text>
        </g>
      )}
    </g>
  );
}

export default memo(WireEdgeComponent);
