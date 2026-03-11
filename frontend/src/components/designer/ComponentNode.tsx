'use client';

import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { PlacedComponentData, ComponentPin } from './designerTypes';
import { CATEGORY_COLORS } from './componentCatalog';
import { useDesignerStore } from './useDesignerStore';
import { X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

function ComponentNodeComponent({ id, data }: NodeProps) {
  const { label, category, icon, pins } = data as PlacedComponentData;
  const removeNode = useDesignerStore((s) => s.removeNode);
  const [hovered, setHovered] = useState(false);
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.misc;

  // Dynamically resolve the lucide icon
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[icon] || LucideIcons.CircuitBoard;

  return (
    <div
      className={`${colors.bg} border ${colors.border} rounded-lg shadow-lg min-w-[160px] relative`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className={`flex items-center gap-2 px-3 py-1.5 border-b ${colors.border} rounded-t-lg`}>
        <IconComponent className={`w-4 h-4 ${colors.text}`} />
        <span className={`text-xs font-bold ${colors.text} flex-1`}>{label}</span>
        {hovered && (
          <button
            onClick={(e) => { e.stopPropagation(); removeNode(id); }}
            className="text-gray-500 hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Pins */}
      {pins.length > 0 && (
        <div className="flex flex-col gap-[2px] py-1.5 px-1">
          {(pins as ComponentPin[]).map((pin) => (
            <div key={pin.id} className="relative flex items-center justify-end h-[22px] pr-1">
              <span className={`text-[10px] font-mono mr-2 ${pinColor(pin)}`}>
                {pin.label}
              </span>
              <Handle
                type="source"
                position={Position.Right}
                id={pin.id}
                className="!-right-[6px]"
                style={pinStyle(pin)}
              />
            </div>
          ))}
        </div>
      )}

      {/* No-pin components (built-in like WiFi, BLE) */}
      {pins.length === 0 && (
        <div className="px-3 py-2 text-[10px] text-gray-500 italic">Built-in (no wiring needed)</div>
      )}
    </div>
  );
}

function pinColor(pin: ComponentPin): string {
  if (pin.type === 'power') return 'text-red-400';
  if (pin.type === 'ground') return 'text-gray-500';
  if (pin.type === 'i2c') return 'text-purple-400';
  if (pin.type === 'spi') return 'text-blue-400';
  if (pin.type === 'uart') return 'text-green-400';
  if (pin.type === 'pwm') return 'text-yellow-400';
  return 'text-gray-300';
}

function pinStyle(pin: ComponentPin): React.CSSProperties {
  if (pin.type === 'power') return { borderColor: '#ef4444' };
  if (pin.type === 'ground') return { borderColor: '#333' };
  if (pin.type === 'i2c') return { borderColor: '#8b5cf6' };
  if (pin.type === 'spi') return { borderColor: '#3b82f6' };
  if (pin.type === 'uart') return { borderColor: '#10b981' };
  if (pin.type === 'pwm') return { borderColor: '#eab308' };
  return {};
}

export default memo(ComponentNodeComponent);
