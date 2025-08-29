import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'
import type { GitHubRepository, AuditRequest } from '@/types/audit'

export class GitHubService {
  private octokit: Octokit
  private appId?: string
  private privateKey?: string
  private appOctokit?: Octokit

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token || process.env.GITHUB_TOKEN
    })

    // GitHub App configuration
    this.appId = process.env.GITHUB_APP_ID
    this.privateKey = process.env.GITHUB_APP_PRIVATE_KEY

    // Initialize GitHub App authentication if credentials are available
    if (this.appId && this.privateKey) {
      this.appOctokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
          appId: this.appId,
          privateKey: this.privateKey.replace(/\\n/g, '\n') // Handle escaped newlines
        }
      })
    }
  }

  /**
   * Parse a GitHub repository URL to extract owner and repo name
   */
  parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
      throw new Error('Invalid GitHub repository URL')
    }
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, '')
    }
  }

  /**
   * Validate repository access and get repository information
   */
  async validateRepository(repoUrl: string, token?: string): Promise<GitHubRepository> {
    const { owner, repo } = this.parseRepoUrl(repoUrl)

    // Use provided token if available
    const octokit = token ? new Octokit({ auth: token }) : this.octokit

    try {
      const { data } = await octokit.rest.repos.get({
        owner,
        repo
      })

      return {
        owner,
        name: repo,
        fullName: data.full_name,
        private: data.private,
        defaultBranch: data.default_branch,
        hasAccess: true
      }
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        error.status === 404
      ) {
        throw new Error('Repository not found or you do not have access to it')
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to access repository: ${errorMessage}`)
    }
  }

  /**
   * Check if the repository has Next.js and MUI dependencies
   */
  async checkProjectCompatibility(
    repoUrl: string,
    token?: string
  ): Promise<{
    hasNextjs: boolean
    hasMui: boolean
    packageJsonContent?: Record<string, unknown>
  }> {
    const { owner, repo } = this.parseRepoUrl(repoUrl)
    const octokit = token ? new Octokit({ auth: token }) : this.octokit

    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: 'package.json'
      })

      if ('content' in data) {
        const packageJsonContent = JSON.parse(
          Buffer.from(data.content, 'base64').toString('utf-8')
        )

        const dependencies = {
          ...packageJsonContent.dependencies,
          ...packageJsonContent.devDependencies
        }

        const hasNextjs = !!(dependencies.next || dependencies['@next/core'])
        const hasMui = !!(
          dependencies['@mui/material'] ||
          dependencies['@material-ui/core'] ||
          dependencies['@mui/core']
        )

        return {
          hasNextjs,
          hasMui,
          packageJsonContent
        }
      }

      return {
        hasNextjs: false,
        hasMui: false
      }
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        error.status === 404
      ) {
        throw new Error('package.json not found in repository')
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to check project compatibility: ${errorMessage}`)
    }
  }

  /**
   * Trigger a GitHub Actions workflow
   */
  async triggerWorkflow(
    repoUrl: string,
    workflowFileName: string,
    inputs: Record<string, unknown>,
    token?: string
  ): Promise<{ success: boolean; workflowRunId?: number; error?: string }> {
    const { owner, repo } = this.parseRepoUrl(repoUrl)
    const octokit = token ? new Octokit({ auth: token }) : this.octokit

    try {
      // First, check if the workflow file exists
      await octokit.rest.repos.getContent({
        owner,
        repo,
        path: `.github/workflows/${workflowFileName}`
      })

      // Trigger the workflow
      const response = await octokit.rest.actions.createWorkflowDispatch({
        owner,
        repo,
        workflow_id: workflowFileName,
        ref: (inputs.branch as string) || 'main',
        inputs
      })

      // The workflow dispatch doesn't return the run ID directly
      // We need to fetch recent workflow runs to find the one we just triggered
      const workflowRuns = await octokit.rest.actions.listWorkflowRuns({
        owner,
        repo,
        workflow_id: workflowFileName,
        per_page: 1
      })

      const latestRun = workflowRuns.data.workflow_runs[0]

      return {
        success: true,
        workflowRunId: latestRun?.id
      }
    } catch (error: any) {
      if (error.status === 404) {
        return {
          success: false,
          error: 'GitHub Actions workflow not found in repository'
        }
      }
      return {
        success: false,
        error: `Failed to trigger workflow: ${error.message}`
      }
    }
  }

  /**
   * Get workflow run status by owner, repo, and run ID
   */
  async getWorkflowRunStatus(
    owner: string,
    repo: string,
    runId: number,
    token?: string
  ): Promise<{
    id: number
    status: string | null
    conclusion: string | null
    html_url: string
    created_at: string
    updated_at: string
  }> {
    const octokit = token ? new Octokit({ auth: token }) : this.octokit

    try {
      const { data } = await octokit.rest.actions.getWorkflowRun({
        owner,
        repo,
        run_id: runId
      })

      return {
        id: data.id,
        status: data.status,
        conclusion: data.conclusion,
        html_url: data.html_url,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error: any) {
      throw new Error(`Failed to get workflow run status: ${error.message}`)
    }
  }

  /**
   * Create the audit workflow file in the repository
   */
  async createAuditWorkflow(
    repoUrl: string,
    token?: string
  ): Promise<{ success: boolean; error?: string }> {
    const { owner, repo } = this.parseRepoUrl(repoUrl)
    const octokit = token ? new Octokit({ auth: token }) : this.octokit

    const workflowContent = `name: Next.js + MUI Audit by dev-mhany

on:
  workflow_dispatch:
    inputs:
      audit_config:
        description: 'Audit configuration (JSON)'
        required: false
        default: '{}'
      user_email:
        description: 'User email for notifications'
        required: false

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: \${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Next.js + MUI Audit
        run: npx nextjs-mui-audit-toolkit run --output ./audit-results --fix
        env:
          AUDIT_CONFIG: \${{ github.event.inputs.audit_config }}

      - name: Commit audit results
        run: |
          git config --local user.email "audit-bot@dev-mhany.com"
          git config --local user.name "dev-mhany audit bot"
          git add audit-results/
          if [ -n "$(git status --porcelain)" ]; then
            git commit -m "🔍 Automated audit by dev-mhany - $(date)"
            git push
            echo "✅ Audit results committed successfully"
          else
            echo "ℹ️ No changes to commit"
          fi

      - name: Upload audit artifacts
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: audit-results
          path: audit-results/
          retention-days: 30

      - name: Notify completion
        if: always() && github.event.inputs.user_email != ''
        run: |
          echo "Audit completed for \${{ github.repository }}"
          # Add email notification logic here if needed
`

    try {
      // Check if workflow already exists
      try {
        await octokit.rest.repos.getContent({
          owner,
          repo,
          path: '.github/workflows/nextjs-mui-audit.yml'
        })

        // Workflow already exists
        return { success: true }
      } catch (error: any) {
        if (error.status !== 404) {
          throw error
        }
      }

      // Create the workflow file
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: '.github/workflows/nextjs-mui-audit.yml',
        message: 'Add Next.js + MUI audit workflow by dev-mhany',
        content: Buffer.from(workflowContent).toString('base64'),
        branch: 'main'
      })

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to create workflow: ${error.message}`
      }
    }
  }

  /**
   * GitHub App Integration Methods
   */

  /**
   * Get installation for a repository
   */
  async getInstallation(owner: string, repo: string): Promise<any | null> {
    if (!this.appOctokit) {
      throw new Error('GitHub App authentication not configured')
    }

    try {
      const { data } = await this.appOctokit.rest.apps.getRepoInstallation({
        owner,
        repo
      })
      return data
    } catch (error: any) {
      if (error.status === 404) {
        return null // App not installed
      }
      throw error
    }
  }

  /**
   * Get installation by ID
   */
  async getInstallationById(installationId: string): Promise<any | null> {
    if (!this.appOctokit) {
      throw new Error('GitHub App authentication not configured')
    }

    try {
      const { data } = await this.appOctokit.rest.apps.getInstallation({
        installation_id: parseInt(installationId, 10)
      })
      return data
    } catch (error: any) {
      if (error.status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * Create installation access token
   */
  async createInstallationToken(installationId: number): Promise<string> {
    if (!this.appOctokit) {
      throw new Error('GitHub App authentication not configured')
    }

    try {
      const { data } = await this.appOctokit.rest.apps.createInstallationAccessToken({
        installation_id: installationId,
        permissions: {
          contents: 'write',
          pull_requests: 'write',
          checks: 'write',
          metadata: 'read',
          actions: 'read'
        }
      })
      return data.token
    } catch (error: any) {
      throw new Error(`Failed to create installation token: ${error.message}`)
    }
  }

  /**
   * Trigger repository dispatch event
   */
  async triggerRepositoryDispatch(
    owner: string,
    repo: string,
    eventType: string,
    clientPayload: any,
    token?: string
  ): Promise<{ success: boolean; runId?: number; error?: string }> {
    const octokit = token ? new Octokit({ auth: token }) : this.octokit

    try {
      await octokit.rest.repos.createDispatchEvent({
        owner,
        repo,
        event_type: eventType,
        client_payload: clientPayload
      })

      // Wait a moment then get the latest workflow run
      await new Promise(resolve => setTimeout(resolve, 2000))

      const runs = await this.getWorkflowRuns(owner, repo, 'run-audit.yml', token)
      const latestRun = runs[0]

      return {
        success: true,
        runId: latestRun?.id
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get workflow runs
   */
  async getWorkflowRuns(
    owner: string,
    repo: string,
    workflowFile: string,
    token?: string
  ): Promise<any[]> {
    const octokit = token ? new Octokit({ auth: token }) : this.octokit

    try {
      const { data } = await octokit.rest.actions.listWorkflowRuns({
        owner,
        repo,
        workflow_id: workflowFile,
        per_page: 10
      })
      return data.workflow_runs
    } catch (error: any) {
      throw new Error(`Failed to get workflow runs: ${error.message}`)
    }
  }

  /**
   * Get pull requests
   */
  async getPullRequests(
    owner: string,
    repo: string,
    options: { state?: 'open' | 'closed' | 'all'; head?: string } = {},
    token?: string
  ): Promise<any[]> {
    const octokit = token ? new Octokit({ auth: token }) : this.octokit

    try {
      const { data } = await octokit.rest.pulls.list({
        owner,
        repo,
        state: options.state || 'open',
        head: options.head,
        per_page: 20
      })
      return data
    } catch (error: any) {
      throw new Error(`Failed to get pull requests: ${error.message}`)
    }
  }

  /**
   * Get workflow artifacts
   */
  async getWorkflowArtifacts(
    owner: string,
    repo: string,
    runId: string,
    token?: string
  ): Promise<any[]> {
    const octokit = token ? new Octokit({ auth: token }) : this.octokit

    try {
      const { data } = await octokit.rest.actions.listWorkflowRunArtifacts({
        owner,
        repo,
        run_id: parseInt(runId, 10)
      })
      return data.artifacts
    } catch (error: any) {
      throw new Error(`Failed to get workflow artifacts: ${error.message}`)
    }
  }

  /**
   * Get repository content
   */
  async getRepositoryContent(
    owner: string,
    repo: string,
    path: string,
    ref?: string,
    token?: string
  ): Promise<any> {
    const octokit = token ? new Octokit({ auth: token }) : this.octokit

    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref
      })
      return data
    } catch (error: any) {
      throw new Error(`Failed to get repository content: ${error.message}`)
    }
  }

  /**
   * Get check runs
   */
  async getCheckRuns(
    owner: string,
    repo: string,
    runId: string,
    token?: string
  ): Promise<any[]> {
    const octokit = token ? new Octokit({ auth: token }) : this.octokit

    try {
      // Get the commit SHA from the workflow run
      const { data: run } = await octokit.rest.actions.getWorkflowRun({
        owner,
        repo,
        run_id: parseInt(runId, 10)
      })

      const { data } = await octokit.rest.checks.listForRef({
        owner,
        repo,
        ref: run.head_sha
      })
      return data.check_runs
    } catch (error: any) {
      throw new Error(`Failed to get check runs: ${error.message}`)
    }
  }

  /**
   * Verify webhook signature with enhanced security
   */
  async verifyWebhookSignature(
    payload: string,
    signature: string,
    secret?: string
  ): Promise<boolean> {
    const webhookSecret = secret || process.env.GITHUB_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      return false
    }

    try {
      // Normalize signature format
      const normalizedSignature = signature.startsWith('sha256=')
        ? signature
        : `sha256=${signature}`

      // Create HMAC using Web Crypto API (Node.js 16+)
      const encoder = new TextEncoder()
      const keyBuffer = encoder.encode(webhookSecret)
      const payloadBuffer = encoder.encode(payload)

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )

      const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, payloadBuffer)

      // Convert to hex string
      const computedSignature =
        'sha256=' +
        Array.from(new Uint8Array(signatureBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')

      // Use timing-safe comparison
      return this.timingSafeEqual(normalizedSignature, computedSignature)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return false
    }
  }

  /**
   * Timing-safe string comparison to prevent timing attacks
   */
  private timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false
    }

    let result = 0
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }

    return result === 0
  }
}

export const githubService = new GitHubService()
