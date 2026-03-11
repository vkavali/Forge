'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { PlacedBoardData, BoardGpioPin } from './designerTypes';
import { Cpu } from 'lucide-react';

function BoardNodeComponent({ data }: NodeProps) {
  const { boardName, processor, pins } = data as PlacedBoardData;
  const leftPins = pins.filter((p: BoardGpioPin) => p.side === 'left');
  const rightPins = pins.filter((p: BoardGpioPin) => p.side === 'right');
  const maxSide = Math.max(leftPins.length, rightPins.length);

  return (
    <div
      className="bg-gray-900 border-2 border-amber-600 rounded-xl shadow-lg shadow-amber-900/20 min-w-[320px]"
      style={{ minHeight: maxSide * 28 + 80 }}
    >
      {/* Header */}
      <div className="bg-amber-600/20 border-b border-amber-600 rounded-t-xl px-4 py-2 flex items-center gap-2">
        <Cpu className="w-5 h-5 text-amber-400" />
        <div>
          <div className="text-sm font-bold text-amber-200">{boardName}</div>
          <div className="text-[10px] text-amber-400/70">{processor}</div>
        </div>
      </div>

      {/* Pin columns */}
      <div className="flex justify-between px-1 py-2 gap-4">
        {/* Left pins */}
        <div className="flex flex-col gap-[2px]">
          {leftPins.map((pin: BoardGpioPin) => (
            <div key={pin.id} className="relative flex items-center h-[24px] pl-1">
              <Handle
                type="target"
                position={Position.Left}
                id={pin.id}
                className="!-left-[6px]"
                style={handleStyle(pin)}
              />
              <span className={`text-[10px] font-mono ml-2 ${pinTextColor(pin)}`}>
                {pin.label}
                {pin.altFunction && (
                  <span className="text-gray-500 ml-1">/ {pin.altFunction}</span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Right pins */}
        <div className="flex flex-col gap-[2px]">
          {rightPins.map((pin: BoardGpioPin) => (
            <div key={pin.id} className="relative flex items-center justify-end h-[24px] pr-1">
              <span className={`text-[10px] font-mono mr-2 ${pinTextColor(pin)}`}>
                {pin.altFunction && (
                  <span className="text-gray-500 mr-1">{pin.altFunction} /</span>
                )}
                {pin.label}
              </span>
              <Handle
                type="target"
                position={Position.Right}
                id={pin.id}
                className="!-right-[6px]"
                style={handleStyle(pin)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function handleStyle(pin: BoardGpioPin): React.CSSProperties {
  if (pin.capabilities.includes('power')) return { borderColor: '#ef4444' };
  if (pin.capabilities.includes('ground')) return { borderColor: '#333' };
  if (pin.capabilities.includes('i2c')) return { borderColor: '#8b5cf6' };
  if (pin.capabilities.includes('spi')) return { borderColor: '#3b82f6' };
  if (pin.capabilities.includes('uart')) return { borderColor: '#10b981' };
  return {};
}

function pinTextColor(pin: BoardGpioPin): string {
  if (pin.capabilities.includes('power')) return 'text-red-400';
  if (pin.capabilities.includes('ground')) return 'text-gray-500';
  return 'text-gray-300';
}

export default memo(BoardNodeComponent);
