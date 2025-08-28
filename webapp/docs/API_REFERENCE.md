# API Documentation

Complete API reference for the Next.js + MUI Audit Toolkit webapp.

## Base URL

```
https://your-domain.com/api
```

## Authentication

The API supports two authentication modes:

1. **GitHub App** (Recommended) - Uses short-lived installation tokens
2. **Personal Access Token** (Fallback) - Uses user-provided PAT

## Endpoints

### POST /api/create-audit

Creates a new audit for a GitHub repository.

#### Request Body

```typescript
interface CreateAuditRequest {
  repoUrl: string;                    // GitHub repository URL
  mode: 'app' | 'pat';               // Authentication mode
  pat?: string;                      // Required if mode is 'pat'
  userEmail?: string;                // Optional email for notifications
  options?: {
    createPR?: boolean;              // Create PR with results (default: true)
    staticOnly?: boolean;            // Static analysis only (default: true)
    autoMerge?: boolean;             // Auto-merge on pass (default: false)
  };
}
```

#### Example Request

```json
{
  "repoUrl": "https://github.com/owner/repository",
  "mode": "app",
  "userEmail": "user@example.com",
  "options": {
    "createPR": true,
    "staticOnly": true,
    "autoMerge": false
  }
}
```

#### Response

```typescript
interface CreateAuditResponse {
  success: boolean;
  runId?: number;                    // GitHub workflow run ID
  prUrl?: string;                    // Pull request URL (available later)
  auditId: string;                   // Internal audit ID
  message: string;                   // Status message
}
```

#### Example Response

```json
{
  "success": true,
  "runId": 1234567890,
  "auditId": "audit_1693440000000_abc123def",
  "message": "Audit triggered successfully"
}
```

#### Error Responses

```json
// GitHub App not installed
{
  "error": "GitHub App not installed for this repository. Please install the app first.",
  "details": "Installation required"
}

// Invalid repository URL
{
  "error": "Invalid GitHub repository URL",
  "details": "Must be in format: https://github.com/owner/repo"
}

// PAT validation failed
{
  "error": "Invalid GitHub token format",
  "details": "Token must be a valid GitHub personal access token"
}
```

### GET /api/audit-status

Gets the current status of an audit.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `runId` | string | Yes | GitHub workflow run ID |

#### Example Request

```
GET /api/audit-status?runId=1234567890
```

#### Response

```typescript
interface AuditStatusResponse {
  state: 'queued' | 'running' | 'completed' | 'failed';
  grade?: string;                    // Letter grade (A-F)
  prUrl?: string;                    // Pull request URL
  artifacts?: Record<string, any>;   // Audit artifacts
  auditId: string;                   // Internal audit ID
  repoUrl: string;                   // Repository URL
  createdAt: string;                 // ISO timestamp
  updatedAt: string;                 // ISO timestamp
  error?: string;                    // Error message if failed
}
```

#### Example Response

```json
{
  "state": "completed",
  "grade": "B+",
  "prUrl": "https://github.com/owner/repo/pull/123",
  "artifacts": {
    "audit-results": {
      "url": "https://github.com/owner/repo/actions/runs/1234567890",
      "size": 1024000,
      "createdAt": "2023-08-31T10:00:00Z"
    }
  },
  "auditId": "audit_1693440000000_abc123def",
  "repoUrl": "https://github.com/owner/repository",
  "createdAt": "2023-08-31T09:45:00Z",
  "updatedAt": "2023-08-31T10:00:00Z"
}
```

### GET/POST /api/auth/github/callback

Handles GitHub App installation and webhook events.

#### GET - Installation Callback

Processes GitHub App installation redirects.

##### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `installation_id` | string | Yes | GitHub installation ID |
| `setup_action` | string | No | Installation action |

##### Response

Redirects to success or error page.

#### POST - Webhook Events

Processes GitHub webhook events.

##### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `x-hub-signature-256` | string | Yes | Webhook signature |
| `x-github-event` | string | Yes | Event type |

##### Supported Events

- `installation` - App installation/uninstallation
- `installation_repositories` - Repository access changes
- `pull_request` - PR events for audit results
- `check_run` - Check run status updates
- `workflow_run` - Workflow execution events

##### Response

```json
{
  "success": true
}
```

### GET /api/audit/[id]

Gets detailed information about a specific audit.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Audit ID |

#### Response

```typescript
interface AuditDetailResponse {
  id: string;
  repoUrl: string;
  branch: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'queued';
  mode?: 'app' | 'pat';
  score?: number;                    // Overall score (0-100)
  letterGrade?: string;              // Letter grade (A-F)
  criticalIssues?: number;           // Number of critical issues
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  reportUrl?: string;
  workflowRunId?: string;
  error?: string;
  userEmail?: string;
  prUrl?: string;
  prNumber?: number;
  prState?: string;
  checkRunUrl?: string;
  artifacts?: Record<string, any>;
  githubWorkflow?: {
    id: number;
    status: string;
    conclusion: string | null;
    html_url: string;
    created_at: string;
    updated_at: string;
  };
  progress?: {
    percentage: number;
    step: string;
    estimatedTimeRemaining?: string;
  };
}
```

## Error Handling

### Standard Error Format

All API errors follow this format:

```typescript
interface ApiError {
  error: string;                     // Main error message
  details?: string;                  // Additional details
  code?: string;                     // Error code
  field?: string;                    // Field that caused error (validation)
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Common Error Scenarios

#### GitHub App Not Installed

```json
{
  "error": "GitHub App not installed for this repository",
  "details": "Please install the dev-mhany audit toolkit app",
  "code": "APP_NOT_INSTALLED"
}
```

#### Invalid Repository Access

```json
{
  "error": "Repository not found or you do not have access to it",
  "details": "Check repository URL and permissions",
  "code": "REPO_ACCESS_DENIED"
}
```

#### Rate Limit Exceeded

```json
{
  "error": "Rate limit exceeded",
  "details": "Too many requests. Try again in 60 seconds",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/create-audit` | 10 requests | 1 minute |
| `/api/audit-status` | 60 requests | 1 minute |
| `/api/auth/github/callback` | 100 requests | 1 minute |

## Webhooks

### Webhook URLs

```
POST https://your-domain.com/api/auth/github/callback
```

### Webhook Events

#### Installation Events

```json
{
  "action": "created",
  "installation": {
    "id": 12345,
    "account": {
      "login": "octocat",
      "type": "User"
    },
    "repository_selection": "selected",
    "permissions": {
      "contents": "write",
      "pull_requests": "write"
    }
  }
}
```

#### Workflow Run Events

```json
{
  "action": "completed",
  "workflow_run": {
    "id": 1234567890,
    "status": "completed",
    "conclusion": "success",
    "head_branch": "chore/audit-20230831-100000",
    "repository": {
      "full_name": "owner/repo"
    }
  }
}
```

### Webhook Security

All webhooks are verified using HMAC-SHA256 signatures:

```typescript
const signature = request.headers['x-hub-signature-256'];
const payload = request.body;
const secret = process.env.GITHUB_WEBHOOK_SECRET;

const isValid = verifySignature(payload, signature, secret);
```

## SDK Usage Examples

### JavaScript/TypeScript

```typescript
import fetch from 'node-fetch';

// Create audit
const createAudit = async (repoUrl: string, userEmail?: string) => {
  const response = await fetch('/api/create-audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      repoUrl,
      mode: 'app',
      userEmail,
      options: {
        createPR: true,
        staticOnly: true,
        autoMerge: false
      }
    }),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

// Check audit status
const checkAuditStatus = async (runId: string) => {
  const response = await fetch(`/api/audit-status?runId=${runId}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};
```

### curl Examples

```bash
# Create audit
curl -X POST https://your-domain.com/api/create-audit \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/owner/repository",
    "mode": "app",
    "userEmail": "user@example.com",
    "options": {
      "createPR": true,
      "staticOnly": true
    }
  }'

# Check status
curl "https://your-domain.com/api/audit-status?runId=1234567890"

# Get audit details
curl "https://your-domain.com/api/audit/audit_1693440000000_abc123def"
```

## OpenAPI Specification

The complete OpenAPI 3.0 specification is available at:

```
GET /api/openapi.json
```

This provides machine-readable API documentation for code generation and testing tools.