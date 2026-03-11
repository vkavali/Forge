'use client'

import { useState, useMemo } from 'react'
import * as Icons from 'lucide-react'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'
import { COMPONENT_CATALOG, CATEGORY_CONFIG } from './componentCatalog'
import type { ComponentCategory, HardwareComponent } from './designerTypes'

function ComponentTile({ component }: { component: HardwareComponent }) {
  const config = CATEGORY_CONFIG[component.category] || CATEGORY_CONFIG.misc
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[component.icon] || Icons.Cpu

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/shipboard-component', component.id)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      title={component.description}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-grab
                  border transition-all select-none
                  bg-zinc-900/50 hover:bg-zinc-800 active:scale-95
                  ${config.border} hover:border-opacity-60`}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${config.color}`} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-zinc-300 truncate leading-tight">{component.label}</p>
        <p className="text-[10px] text-zinc-600 truncate">${component.estimatedCostUsd.toFixed(2)}</p>
      </div>
    </div>
  )
}

function CategorySection({
  category, components,
}: { category: ComponentCategory; components: HardwareComponent[] }) {
  const [open, setOpen] = useState(true)
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.misc

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center justify-between w-full px-2 py-1.5
                    text-xs font-medium rounded-lg transition-colors
                    hover:bg-zinc-800/50 ${config.color}`}
      >
        <span>{config.label} ({components.length})</span>
        {open
          ? <ChevronDown className="w-3 h-3" />
          : <ChevronRight className="w-3 h-3" />
        }
      </button>
      {open && (
        <div className="mt-1 space-y-0.5 pl-1">
          {components.map(c => <ComponentTile key={c.id} component={c} />)}
        </div>
      )}
    </div>
  )
}

export default function ComponentPalette() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return COMPONENT_CATALOG
    const q = search.toLowerCase()
    return COMPONENT_CATALOG.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.displayName.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    )
  }, [search])

  const grouped = useMemo(() => {
    return filtered.reduce((acc, c) => {
      if (!acc[c.category]) acc[c.category] = []
      acc[c.category].push(c)
      return acc
    }, {} as Record<ComponentCategory, HardwareComponent[]>)
  }, [filtered])

  const categoryOrder: ComponentCategory[] = [
    'sensor', 'display', 'actuator', 'motor',
    'communication', 'storage', 'audio', 'timing', 'misc',
  ]

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800">
      {/* Header */}
      <div className="p-3 border-b border-zinc-800">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">
          Components
        </p>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg
                       pl-7 pr-3 py-1.5 text-xs text-zinc-300
                       placeholder:text-zinc-600 focus:outline-none
                       focus:border-amber-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Component list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {categoryOrder.map(cat => {
          const comps = grouped[cat]
          if (!comps?.length) return null
          return (
            <CategorySection
              key={cat}
              category={cat}
              components={comps}
            />
          )
        })}
        {filtered.length === 0 && (
          <p className="text-xs text-zinc-600 text-center py-4">
            No components match &quot;{search}&quot;
          </p>
        )}
      </div>

      {/* Drag hint */}
      <div className="p-2 border-t border-zinc-800">
        <p className="text-[10px] text-zinc-700 text-center">
          Drag components onto the canvas
        </p>
      </div>
    </div>
  )
}
