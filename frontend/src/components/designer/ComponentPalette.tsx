'use client';

import { useState, useMemo } from 'react';
import { COMPONENT_CATALOG, CATEGORY_COLORS, CATEGORY_LABELS } from './componentCatalog';
import type { HardwareComponent, ComponentCategory } from './designerTypes';
import { Input } from '../ui/input';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function ComponentPalette() {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    if (!search.trim()) return COMPONENT_CATALOG;
    const q = search.toLowerCase();
    return COMPONENT_CATALOG.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map = new Map<ComponentCategory, HardwareComponent[]>();
    for (const comp of filtered) {
      const list = map.get(comp.category) || [];
      list.push(comp);
      map.set(comp.category, list);
    }
    return map;
  }, [filtered]);

  const categoryOrder: ComponentCategory[] = [
    'sensor', 'display', 'actuator', 'communication',
    'storage', 'audio', 'motor', 'timing', 'misc',
  ];

  const toggleCategory = (cat: string) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const onDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData('application/designer-component', componentId);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-[260px] min-w-[260px] bg-gray-900 border-r border-gray-800 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-3 py-3 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-200 mb-2">Components</h3>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Component list */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {categoryOrder.map((cat) => {
          const items = grouped.get(cat);
          if (!items || items.length === 0) return null;
          const colors = CATEGORY_COLORS[cat];
          const isCollapsed = collapsed[cat];

          return (
            <div key={cat}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat)}
                className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-semibold ${colors.text} hover:bg-gray-800/50 transition-colors`}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                {CATEGORY_LABELS[cat]}
                <span className="text-gray-600 font-normal ml-auto">{items.length}</span>
              </button>

              {/* Component tiles */}
              {!isCollapsed && (
                <div className="space-y-0.5 ml-1">
                  {items.map((comp) => (
                    <ComponentTile key={comp.id} comp={comp} onDragStart={onDragStart} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center text-gray-600 text-xs py-8">No components found</div>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-2 border-t border-gray-800 text-[10px] text-gray-600">
        Drag components onto the canvas
      </div>
    </div>
  );
}

function ComponentTile({
  comp,
  onDragStart,
}: {
  comp: HardwareComponent;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) {
  const colors = CATEGORY_COLORS[comp.category];
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[comp.icon] || LucideIcons.CircuitBoard;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, comp.id)}
      className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-grab active:cursor-grabbing
        hover:${colors.bg} border border-transparent hover:${colors.border}
        transition-all group`}
      title={comp.description}
    >
      <IconComponent className={`w-3.5 h-3.5 ${colors.text} opacity-70 group-hover:opacity-100`} />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-300 truncate">{comp.name}</div>
        <div className="text-[10px] text-gray-600 truncate">{comp.description}</div>
      </div>
      {comp.pins.length > 0 && (
        <span className="text-[9px] text-gray-600">{comp.pins.length}p</span>
      )}
    </div>
  );
}
