'use client'

import { memo, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { Cpu } from 'lucide-react'
import type { PlacedBoardData, BoardGpioPin } from './designerTypes'

const PIN_TYPE_COLORS: Record<string, string> = {
  digital: 'bg-zinc-600 hover:bg-amber-500',
  analog:  'bg-blue-700 hover:bg-blue-500',
  i2c:     'bg-purple-700 hover:bg-purple-500',
  spi:     'bg-cyan-700 hover:bg-cyan-500',
  uart:    'bg-green-700 hover:bg-green-500',
  pwm:     'bg-orange-700 hover:bg-orange-500',
  power:   'bg-red-800 hover:bg-red-600',
  ground:  'bg-zinc-800 hover:bg-zinc-600',
}

function PinRow({ pin, side }: { pin: BoardGpioPin; side: 'left' | 'right' }) {
  const [hovered, setHovered] = useState(false)
  const colorClass = PIN_TYPE_COLORS[pin.type] || PIN_TYPE_COLORS.digital

  return (
    <div
      className={`relative flex items-center gap-1.5 py-0.5 px-2 text-xs
        ${side === 'right' ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Handle
        type="target"
        position={side === 'left' ? Position.Left : Position.Right}
        id={pin.id}
        className={`!w-2.5 !h-2.5 !rounded-full !border-0 transition-colors ${colorClass}`}
        style={{ position: 'static', transform: 'none' }}
      />
      <span className={`font-mono transition-colors
        ${hovered ? 'text-amber-400' : 'text-zinc-400'}`}>
        {pin.label}
      </span>
      {pin.i2cBus && (
        <span className="text-purple-500 text-[9px]">BUS</span>
      )}
    </div>
  )
}

function BoardNodeComponent({ data }: NodeProps) {
  const { boardName, processor, pins } = data as PlacedBoardData
  const leftPins = pins.filter((p: BoardGpioPin) => p.side === 'left')
  const rightPins = pins.filter((p: BoardGpioPin) => p.side === 'right')

  return (
    <div className="bg-zinc-900 border-2 border-amber-500/70 rounded-xl
                    shadow-[0_0_20px_rgba(245,158,11,0.15)] min-w-[260px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-amber-500/30
                      bg-amber-500/5 rounded-t-xl">
        <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
        <div>
          <p className="text-xs font-bold text-amber-300 leading-tight">{boardName}</p>
          <p className="text-[10px] text-zinc-500">{processor}</p>
        </div>
      </div>

      {/* Pins — two column layout */}
      <div className="flex py-1">
        <div className="flex-1">
          {leftPins.map((pin: BoardGpioPin) => (
            <PinRow key={pin.id} pin={pin} side="left" />
          ))}
        </div>
        <div className="w-px bg-zinc-800 mx-1" />
        <div className="flex-1">
          {rightPins.map((pin: BoardGpioPin) => (
            <PinRow key={pin.id} pin={pin} side="right" />
          ))}
        </div>
      </div>

      {/* Pin legend */}
      <div className="flex flex-wrap gap-1.5 px-3 py-2 border-t border-zinc-800">
        {Object.entries({ digital: 'Digital', analog: 'Analog', i2c: 'I2C',
                          spi: 'SPI', uart: 'UART', pwm: 'PWM' }).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${(PIN_TYPE_COLORS[type] || '').split(' ')[0]}`} />
            <span className="text-[9px] text-zinc-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(BoardNodeComponent)
