'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DeviceCategoryInfo } from '../../lib/types';
import { useProjectStore } from '../../stores/projectStore';
import { Card } from '../ui/card';
import { Cpu, Code, Server, Bot, Navigation, Car, Zap, Printer, CircuitBoard, Watch, Music, Factory } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  cpu: Cpu, code: Code, server: Server, bot: Bot, navigation: Navigation,
  car: Car, zap: Zap, printer: Printer, chip: CircuitBoard, watch: Watch, music: Music, factory: Factory,
};

export default function CategorySelector() {
  const [categories, setCategories] = useState<DeviceCategoryInfo[]>([]);
  const { wizardData, updateWizardData, setWizardStep } = useProjectStore();

  useEffect(() => { api.boards.categories().then((res) => setCategories(res.data)); }, []);

  const select = (cat: DeviceCategoryInfo) => { updateWizardData({ category: cat.id }); setWizardStep('board'); };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Choose a Category</h2>
      <p className="text-gray-400 mb-6">Select the type of hardware project you want to build.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Cpu;
          const selected = wizardData.category === cat.id;
          return (
            <Card key={cat.id} onClick={() => select(cat)} className={`cursor-pointer p-5 transition-all hover:border-blue-500 ${selected ? 'border-blue-500 bg-blue-600/10' : ''}`}>
              <Icon className={`w-8 h-8 mb-3 ${selected ? 'text-blue-400' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-white text-sm">{cat.displayName}</h3>
              <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
