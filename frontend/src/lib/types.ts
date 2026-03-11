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
  platformioId: string | null;
  framework: string | null;
  language: string | null;
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
  intentModel: IntentModel | null;
  educationMode: boolean;
  educationLevel: string | null;
  subjectArea: string | null;
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
  educationMode?: boolean;
  educationLevel?: string;
  subjectArea?: string;
}

export interface GenerationJob {
  id: string;
  projectId: string;
  status: string;
  pipelineType: string;
  progress: number;
  currentStep: string;
  currentLayer: number;
  compileSuccess: boolean | null;
  compileLog: string | null;
  artifactKeys: string[];
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

// Intent Model types
export interface SensorIntent {
  type: string;
  pin: string;
  protocol: string;
  variableName: string;
  unit: string;
  readIntervalMs: number;
}

export interface ActuatorIntent {
  type: string;
  pin: string;
  protocol: string;
  variableName: string;
  defaultState: string;
}

export interface LogicRule {
  condition: string;
  action: string;
  description: string;
}

export interface ConnectivityIntent {
  protocol: string;
  ssid: string;
  mqttBroker: string;
  mqttTopic: string;
  bleServices: string[];
  endpoint: string;
}

export interface TimingIntent {
  name: string;
  intervalMs: number;
  description: string;
}

export interface ConfigConstant {
  name: string;
  type: string;
  value: string;
  description: string;
}

export interface IntentModel {
  projectName: string;
  boardId: string;
  category: string;
  framework: string;
  language: string;
  sensors: SensorIntent[];
  actuators: ActuatorIntent[];
  logicRules: LogicRule[];
  connectivity: ConnectivityIntent | null;
  timers: TimingIntent[];
  constants: ConfigConstant[];
  requiredLibraries: string[];
  summary: string;
}

// Education types
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  boardId: string;
  difficultyLevel: string;
  subjectArea: string;
  behaviorSpec: string;
  connectionsConfig: Record<string, unknown>;
  learningObjectives: string[];
  estimatedMinutes: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

export interface Classroom {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  joinCode: string;
  createdAt: string;
}

export interface ClassroomAssignment {
  id: string;
  classroomId: string;
  templateId: string | null;
  title: string;
  instructions: string;
  dueDate: string | null;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  projectId: string;
  status: string;
  feedback: string | null;
  grade: number | null;
  submittedAt: string;
}

export type WizardStep = 'category' | 'board' | 'connections' | 'behavior' | 'review';
