'use client';

import { useProjectStore } from '../../../../stores/projectStore';
import CategorySelector from '../../../../components/wizard/CategorySelector';
import BoardSelector from '../../../../components/wizard/BoardSelector';
import ConnectionsConfig from '../../../../components/wizard/ConnectionsConfig';
import BehaviorSpec from '../../../../components/wizard/BehaviorSpec';
import ReviewGenerate from '../../../../components/wizard/ReviewGenerate';

const stepLabels = [{ key: 'category', label: 'Category' }, { key: 'board', label: 'Board' }, { key: 'connections', label: 'Connections' }, { key: 'behavior', label: 'Behavior' }, { key: 'review', label: 'Review' }];

export default function NewProjectPage() {
  const { wizardStep } = useProjectStore();
  const currentIdx = stepLabels.findIndex((s) => s.key === wizardStep);

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        {stepLabels.map((step, i) => (
          <div key={step.key} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${i === currentIdx ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : i < currentIdx ? 'bg-green-600/10 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{i < currentIdx ? '\u2713' : i + 1}</span>{step.label}
            </div>
            {i < stepLabels.length - 1 && <div className={`w-8 h-px mx-1 ${i < currentIdx ? 'bg-green-600/30' : 'bg-gray-800'}`} />}
          </div>
        ))}
      </div>
      {wizardStep === 'category' && <CategorySelector />}
      {wizardStep === 'board' && <BoardSelector />}
      {wizardStep === 'connections' && <ConnectionsConfig />}
      {wizardStep === 'behavior' && <BehaviorSpec />}
      {wizardStep === 'review' && <ReviewGenerate />}
    </div>
  );
}
