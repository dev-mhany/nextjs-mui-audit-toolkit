export interface AuditRequest {
  repoUrl: string
  githubToken?: string
  branch?: string
  auditConfig?: AuditConfig
  userEmail?: string
}

export interface CreateAuditRequest {
  repoUrl: string
  mode: 'app' | 'pat'
  pat?: string
  userEmail?: string
  options?: {
    createPR?: boolean
    staticOnly?: boolean
    autoMerge?: boolean
    fix?: boolean
    appPath?: string
    minScore?: number
  }
}

export interface AuditConfig {
  strict?: boolean
  minScore?: number
  fix?: boolean
  skipPlugins?: boolean
  thresholds?: {
    minScore: number
    failOnCritical: boolean
  }
  output?: {
    directory: string
    verbose: boolean
  }
}

export interface AuditResult {
  id: string
  repoUrl: string
  branch: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'queued'
  mode?: 'app' | 'pat'
  score?: number
  letterGrade?: string
  grade?: string // Alternative grade field
  criticalIssues?: number
  createdAt: string
  updatedAt?: string
  completedAt?: string
  reportUrl?: string
  workflowRunId?: string
  error?: string
  userEmail?: string // Email for notifications
  prUrl?: string // Pull request URL
  prNumber?: number // Pull request number
  prState?: string // Pull request state
  checkRunUrl?: string // Check run URL
  artifacts?: Record<string, any> // Audit artifacts
  githubWorkflow?: {
    id: number
    status: string
    conclusion: string | null
    html_url: string
    created_at: string
    updated_at: string
  }
}

export interface GitHubInstallation {
  id: string
  installationId: number
  accountType: string
  accountLogin: string
  repositorySelection: string
  permissions: Record<string, string>
  setupAction?: string
  createdAt: string
  updatedAt: string
  repositories?: string[]
  repositoriesAdded?: Record<string, unknown>[]
  repositoriesRemoved?: Record<string, unknown>[]
}

export interface GitHubRepository {
  owner: string
  name: string
  fullName: string
  private: boolean
  defaultBranch: string
  hasAccess: boolean
}

export interface AuditProgress {
  workflowId: string
  step: string
  percentage: number
  status: 'running' | 'completed' | 'failed' | 'unknown'
  logs: string[]
  audit?: AuditResult
  conclusion?: string
}

export interface AuditSummary {
  totalAudits: number
  completedAudits: number
  averageScore: number
  recentAudits: AuditResult[]
}

export interface GitHubWorkflowRun {
  id: number
  status: string
  conclusion: string
  html_url: string
  created_at: string
  updated_at: string
}

export interface WebhookPayload {
  audit_id: string
  status:
    | 'queued'
    | 'in_progress'
    | 'waiting'
    | 'completed'
    | 'success'
    | 'failure'
    | 'cancelled'
    | 'timed_out'
    | 'skipped'
  workflow_run_id?: number
  repository?: string
  error?: string
  failure_reason?: string
  results?: WebhookResults
}

export interface WebhookResults {
  score?: number
  grade?: string
  critical_issues?: number
  report_url?: string
  completed_at?: string
}

export interface WebhookEvent {
  action: string
  workflow_run?: {
    id: number
    status: string
    conclusion: string
    head_branch: string
    head_sha: string
    repository: {
      full_name: string
      private: boolean
    }
  }
  repository: {
    full_name: string
    private: boolean
    default_branch: string
  }
}
