import { ApiResponse, AuthResponse, BoardDefinition, DeviceCategoryInfo, Project, CreateProjectRequest, GenerationJob, ProjectTemplate, Classroom, ClassroomAssignment, AssignmentSubmission } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; name: string }) =>
      fetchApi<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      fetchApi<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  },
  boards: {
    list: (category?: string) =>
      fetchApi<BoardDefinition[]>(category ? `/boards?category=${category}` : '/boards'),
    categories: () => fetchApi<DeviceCategoryInfo[]>('/categories'),
  },
  projects: {
    list: () => fetchApi<Project[]>('/projects'),
    get: (id: string) => fetchApi<Project>(`/projects/${id}`),
    create: (data: CreateProjectRequest) =>
      fetchApi<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  },
  generation: {
    start: (projectId: string) =>
      fetchApi<GenerationJob>('/generate', { method: 'POST', body: JSON.stringify({ projectId }) }),
    streamUrl: (jobId: string) => `${API_URL}/generate/stream/${jobId}`,
    getJobs: (projectId: string) => fetchApi<GenerationJob[]>(`/jobs?projectId=${projectId}`),
    getJob: (jobId: string) => fetchApi<GenerationJob>(`/jobs/${jobId}`),
    getArtifact: (jobId: string, key: string) =>
      fetchApi<string>(`/artifacts/${jobId}?key=${encodeURIComponent(key)}`),
  },
  templates: {
    list: (category?: string, difficulty?: string) => {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (difficulty) params.set('difficulty', difficulty);
      const qs = params.toString();
      return fetchApi<ProjectTemplate[]>(`/templates/public${qs ? '?' + qs : ''}`);
    },
    get: (id: string) => fetchApi<ProjectTemplate>(`/templates/public/${id}`),
    mine: () => fetchApi<ProjectTemplate[]>('/templates/mine'),
    create: (data: Partial<ProjectTemplate>) =>
      fetchApi<ProjectTemplate>('/templates', { method: 'POST', body: JSON.stringify(data) }),
  },
  classrooms: {
    create: (data: { name: string; description: string }) =>
      fetchApi<Classroom>('/classrooms', { method: 'POST', body: JSON.stringify(data) }),
    teaching: () => fetchApi<Classroom[]>('/classrooms/teaching'),
    enrolled: () => fetchApi<Classroom[]>('/classrooms/enrolled'),
    join: (joinCode: string) =>
      fetchApi<Classroom>('/classrooms/join', { method: 'POST', body: JSON.stringify({ joinCode }) }),
    members: (id: string) => fetchApi<unknown[]>(`/classrooms/${id}/members`),
    createAssignment: (id: string, data: { templateId?: string; title: string; instructions: string }) =>
      fetchApi<ClassroomAssignment>(`/classrooms/${id}/assignments`, { method: 'POST', body: JSON.stringify(data) }),
    assignments: (id: string) => fetchApi<ClassroomAssignment[]>(`/classrooms/${id}/assignments`),
    submitAssignment: (assignmentId: string, projectId: string) =>
      fetchApi<AssignmentSubmission>(`/classrooms/assignments/${assignmentId}/submit`, { method: 'POST', body: JSON.stringify({ projectId }) }),
    submissions: (assignmentId: string) => fetchApi<AssignmentSubmission[]>(`/classrooms/assignments/${assignmentId}/submissions`),
  },
};
