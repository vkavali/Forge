import { create } from 'zustand';
import { Project, CreateProjectRequest, WizardStep } from '../lib/types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  wizardStep: WizardStep;
  wizardData: Partial<CreateProjectRequest>;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setWizardStep: (step: WizardStep) => void;
  updateWizardData: (data: Partial<CreateProjectRequest>) => void;
  resetWizard: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [], currentProject: null, wizardStep: 'category', wizardData: {},
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setWizardStep: (step) => set({ wizardStep: step }),
  updateWizardData: (data) => set((state) => ({ wizardData: { ...state.wizardData, ...data } })),
  resetWizard: () => set({ wizardStep: 'category', wizardData: {} }),
}));
