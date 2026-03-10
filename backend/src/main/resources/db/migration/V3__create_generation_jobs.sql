CREATE TABLE generation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'PENDING',
    pipeline_type VARCHAR(50) NOT NULL,
    progress INTEGER DEFAULT 0,
    current_step VARCHAR(255),
    artifact_keys JSONB DEFAULT '[]',
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_generation_jobs_project_id ON generation_jobs(project_id);
CREATE INDEX idx_generation_jobs_status ON generation_jobs(status);
