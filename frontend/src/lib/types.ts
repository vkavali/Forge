export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  name: string;
}

export interface DeviceCategoryInfo {
  id: string;
  displayName: string;
  description: string;
  icon: string;
}

export interface BoardDefinition {
  id: string;
  name: string;
  category: string;
  processor: string;
  formFactor: string;
  interfaces: string[];
  features: string[];
  imageUrl: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  boardId: string;
  connectionsConfig: Record<string, unknown>;
  behaviorSpec: string;
  extraConfig: Record<string, unknown>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  category: string;
  boardId: string;
  connectionsConfig: Record<string, unknown>;
  behaviorSpec: string;
  extraConfig: Record<string, unknown>;
}

export interface GenerationJob {
  id: string;
  projectId: string;
  status: string;
  pipelineType: string;
  progress: number;
  currentStep: string;
  artifactKeys: string[];
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export type WizardStep = 'category' | 'board' | 'connections' | 'behavior' | 'review';
