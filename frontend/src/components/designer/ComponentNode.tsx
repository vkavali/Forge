'use client'

import { memo, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import * as Icons from 'lucide-react'
import { X, Info } from 'lucide-react'
import type { PlacedComponentData } from './designerTypes'
import { CATEGORY_CONFIG } from './componentCatalog'
import { useDesignerStore } from './useDesignerStore'

const PIN_HANDLE_COLORS: Record<string, string> = {
  digital: '!bg-zinc-500 hover:!bg-amber-400',
  analog:  '!bg-blue-600 hover:!bg-blue-400',
  i2c:     '!bg-purple-600 hover:!bg-purple-400',
  spi:     '!bg-cyan-700 hover:!bg-cyan-400',
  uart:    '!bg-green-700 hover:!bg-green-400',
  pwm:     '!bg-orange-600 hover:!bg-orange-400',
  power:   '!bg-red-800 hover:!bg-red-500',
  ground:  '!bg-zinc-700 hover:!bg-zinc-500',
}

function ComponentNodeComponent({ id, data }: NodeProps) {
  const { component } = data as PlacedComponentData
  const deleteNode = useDesignerStore(s => s.deleteNode)
  const [showTip, setShowTip] = useState(false)

  const config = CATEGORY_CONFIG[component.category] || CATEGORY_CONFIG.misc
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[component.icon] || Icons.Cpu

  return (
    <div className={`relative bg-zinc-900 border rounded-xl shadow-lg min-w-[160px]
                     transition-shadow hover:shadow-amber-500/10 ${config.border}`}>
      {/* Header */}
      <div className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5
                       border-b rounded-t-xl ${config.bg} ${config.border}`}>
        <div className="flex items-center gap-1.5 min-w-0">
          <Icon className={`w-3.5 h-3.5 shrink-0 ${config.color}`} />
          <span className={`text-xs font-semibold truncate ${config.color}`}>
            {component.label}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowTip(v => !v)}
            className="text-zinc-600 hover:text-zinc-300 transition-colors"
            title="Education tip"
          >
            <Info className="w-3 h-3" />
          </button>
          <button
            onClick={() => deleteNode(id)}
            className="text-zinc-600 hover:text-red-400 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Display name */}
      <p className="text-[10px] text-zinc-500 px-2.5 pt-1 pb-0.5 truncate">
        {component.displayName}
      </p>

      {/* Voltage warning */}
      {component.voltageWarning && (
        <p className="text-[10px] text-yellow-500/80 px-2.5 pb-1 leading-tight">
          ⚠ {component.voltageWarning}
        </p>
      )}

      {/* Pins */}
      {component.pins.length > 0 ? (
        <div className="py-1">
          {component.pins.map(pin => (
            <div key={pin.id}
              className="flex items-center justify-end gap-1.5 px-2 py-0.5">
              <span className={`text-[10px] font-mono
                ${pin.required ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {pin.label}
                {!pin.required && <span className="text-zinc-700 ml-0.5">(opt)</span>}
              </span>
              <Handle
                type="source"
                position={Position.Right}
                id={pin.id}
                className={`!w-2.5 !h-2.5 !rounded-full !border-0 !relative
                  !transform-none transition-colors
                  ${PIN_HANDLE_COLORS[pin.type] || PIN_HANDLE_COLORS.digital}`}
                style={{ position: 'static', transform: 'none' }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-2.5 py-2 text-[10px] text-zinc-600 italic">Built-in (no wiring needed)</div>
      )}

      {/* Cost */}
      <div className="border-t border-zinc-800 px-2.5 py-1 flex justify-between">
        <span className="text-[10px] text-zinc-600">
          ~${component.estimatedCostUsd.toFixed(2)}
        </span>
        {component.whereToBuy[0] && (
          <span className="text-[10px] text-zinc-700">
            {component.whereToBuy[0]}
          </span>
        )}
      </div>

      {/* Education tip popover */}
      {showTip && (
        <div className={`absolute left-full ml-2 top-0 z-50 w-56 p-3 rounded-xl
                         bg-zinc-800 border shadow-xl text-xs text-zinc-300
                         leading-relaxed ${config.border}`}>
          <p className={`font-semibold mb-1 ${config.color}`}>How it works</p>
          <p>{component.educationTip}</p>
        </div>
      )}
    </div>
  )
}

export default memo(ComponentNodeComponent)
