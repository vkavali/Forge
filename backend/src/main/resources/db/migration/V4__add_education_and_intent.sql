-- Add intent model and education fields to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS intent_model JSONB;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS education_mode BOOLEAN DEFAULT FALSE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS education_level VARCHAR(50);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS subject_area VARCHAR(100);

-- Add layer tracking fields to generation_jobs
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS current_layer INTEGER DEFAULT 0;
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS compile_success BOOLEAN;
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS compile_log TEXT;
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS result_content JSONB;

-- Education tables
CREATE TABLE IF NOT EXISTS project_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    board_id VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(30),
    subject_area VARCHAR(100),
    behavior_spec TEXT,
    connections_config JSONB DEFAULT '{}',
    learning_objectives JSONB DEFAULT '[]',
    estimated_minutes INTEGER,
    is_public BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES users(id),
    join_code VARCHAR(20) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classroom_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'STUDENT',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(classroom_id, user_id)
);

CREATE TABLE IF NOT EXISTS classroom_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    template_id UUID REFERENCES project_templates(id),
    title VARCHAR(255) NOT NULL,
    instructions TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES classroom_assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    status VARCHAR(30) DEFAULT 'SUBMITTED',
    feedback TEXT,
    grade INTEGER,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_category ON project_templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_public ON project_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_classrooms_teacher ON classrooms(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classroom_members_classroom ON classroom_members(classroom_id);
CREATE INDEX IF NOT EXISTS idx_classroom_members_user ON classroom_members(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_classroom ON classroom_assignments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON assignment_submissions(assignment_id);
