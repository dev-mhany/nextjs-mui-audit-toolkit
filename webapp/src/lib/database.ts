import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';
import type { AuditResult, AuditSummary, GitHubInstallation } from '@/types/audit';

const DATA_DIR = join(process.cwd(), 'data');
const AUDITS_FILE = join(DATA_DIR, 'audits.json');
const INSTALLATIONS_FILE = join(DATA_DIR, 'installations.json');
const SESSIONS_FILE = join(DATA_DIR, 'sessions.json');

interface UserSession {
  id: string;
  userId?: string;
  installationId?: number;
  sessionToken: string;
  createdAt: string;
  expiresAt: string;
  lastActive: string;
  metadata?: Record<string, unknown>;
}

export class DatabaseService {
  constructor() {
    this.ensureDataDirectory();
  }

  private async ensureDataDirectory() {
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
  }

  private async readAudits(): Promise<AuditResult[]> {
    try {
      if (!existsSync(AUDITS_FILE)) {
        return [];
      }
      const data = await readFile(AUDITS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading audits:', error);
      return [];
    }
  }

  private async writeAudits(audits: AuditResult[]): Promise<void> {
    await this.ensureDataDirectory();
    await writeFile(AUDITS_FILE, JSON.stringify(audits, null, 2));
  }

  private async readInstallations(): Promise<GitHubInstallation[]> {
    try {
      if (!existsSync(INSTALLATIONS_FILE)) {
        return [];
      }
      const data = await readFile(INSTALLATIONS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading installations:', error);
      return [];
    }
  }

  private async writeInstallations(installations: GitHubInstallation[]): Promise<void> {
    await this.ensureDataDirectory();
    await writeFile(INSTALLATIONS_FILE, JSON.stringify(installations, null, 2));
  }

  private async readSessions(): Promise<UserSession[]> {
    try {
      if (!existsSync(SESSIONS_FILE)) {
        return [];
      }
      const data = await readFile(SESSIONS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading sessions:', error);
      return [];
    }
  }

  private async writeSessions(sessions: UserSession[]): Promise<void> {
    await this.ensureDataDirectory();
    await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  }

  // Session Management for GitHub App OAuth
  async createSession(installationId?: number, userId?: string, metadata?: Record<string, unknown>): Promise<UserSession> {
    const sessions = await this.readSessions();
    const sessionToken = randomBytes(32).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const newSession: UserSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      installationId,
      sessionToken,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastActive: now.toISOString(),
      metadata,
    };

    sessions.unshift(newSession);
    
    // Clean up old/expired sessions
    await this.cleanupExpiredSessions();
    
    await this.writeSessions(sessions);
    return newSession;
  }

  async getSessionByToken(sessionToken: string): Promise<UserSession | null> {
    const sessions = await this.readSessions();
    const session = sessions.find(s => s.sessionToken === sessionToken);
    
    if (!session) {
      return null;
    }
    
    // Check if session has expired
    if (new Date() > new Date(session.expiresAt)) {
      await this.deleteSession(session.id);
      return null;
    }
    
    // Update last active
    await this.updateSession(session.id, { lastActive: new Date().toISOString() });
    
    return session;
  }

  async updateSession(id: string, updates: Partial<UserSession>): Promise<UserSession | null> {
    const sessions = await this.readSessions();
    const index = sessions.findIndex(session => session.id === id);
    
    if (index === -1) {
      return null;
    }

    sessions[index] = { ...sessions[index], ...updates };
    await this.writeSessions(sessions);
    
    return sessions[index];
  }

  async deleteSession(id: string): Promise<boolean> {
    const sessions = await this.readSessions();
    const initialLength = sessions.length;
    const filteredSessions = sessions.filter(session => session.id !== id);
    
    if (filteredSessions.length === initialLength) {
      return false;
    }

    await this.writeSessions(filteredSessions);
    return true;
  }

  async cleanupExpiredSessions(): Promise<number> {
    const sessions = await this.readSessions();
    const now = new Date();
    
    const validSessions = sessions.filter(session => 
      new Date(session.expiresAt) > now
    );
    
    const deletedCount = sessions.length - validSessions.length;
    
    if (deletedCount > 0) {
      await this.writeSessions(validSessions);
    }
    
    return deletedCount;
  }

  async createAudit(auditData: Omit<AuditResult, 'id' | 'createdAt'>): Promise<AuditResult> {
    const audits = await this.readAudits();
    
    const newAudit: AuditResult = {
      ...auditData,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    audits.unshift(newAudit); // Add to beginning
    await this.writeAudits(audits);
    
    return newAudit;
  }

  async updateAudit(id: string, updates: Partial<AuditResult>): Promise<AuditResult | null> {
    const audits = await this.readAudits();
    const index = audits.findIndex(audit => audit.id === id);
    
    if (index === -1) {
      return null;
    }

    audits[index] = { ...audits[index], ...updates };
    await this.writeAudits(audits);
    
    return audits[index];
  }

  async getAudit(id: string): Promise<AuditResult | null> {
    const audits = await this.readAudits();
    return audits.find(audit => audit.id === id) || null;
  }

  async getAudits(limit: number = 50): Promise<AuditResult[]> {
    const audits = await this.readAudits();
    return audits.slice(0, limit);
  }

  async getAuditsByRepo(repoUrl: string, limit: number = 10): Promise<AuditResult[]> {
    const audits = await this.readAudits();
    return audits
      .filter(audit => audit.repoUrl === repoUrl)
      .slice(0, limit);
  }

  async getAuditSummary(): Promise<AuditSummary> {
    const audits = await this.readAudits();
    
    const totalAudits = audits.length;
    const completedAudits = audits.filter(audit => audit.status === 'completed').length;
    
    const completedAuditsWithScores = audits.filter(
      audit => audit.status === 'completed' && audit.score !== undefined
    );
    
    const averageScore = completedAuditsWithScores.length > 0
      ? completedAuditsWithScores.reduce((sum, audit) => sum + (audit.score || 0), 0) / completedAuditsWithScores.length
      : 0;

    const recentAudits = audits.slice(0, 10);

    return {
      totalAudits,
      completedAudits,
      averageScore,
      recentAudits,
    };
  }

  async deleteAudit(id: string): Promise<boolean> {
    const audits = await this.readAudits();
    const initialLength = audits.length;
    const filteredAudits = audits.filter(audit => audit.id !== id);
    
    if (filteredAudits.length === initialLength) {
      return false; // Audit not found
    }

    await this.writeAudits(filteredAudits);
    return true;
  }

  async cleanupOldAudits(daysOld: number = 30): Promise<number> {
    const audits = await this.readAudits();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const filteredAudits = audits.filter(audit => 
      new Date(audit.createdAt) > cutoffDate
    );
    
    const deletedCount = audits.length - filteredAudits.length;
    
    if (deletedCount > 0) {
      await this.writeAudits(filteredAudits);
    }
    
    return deletedCount;
  }

  // Search audits by repository name or URL
  async searchAudits(query: string, limit: number = 20): Promise<AuditResult[]> {
    const audits = await this.readAudits();
    const lowerQuery = query.toLowerCase();
    
    return audits
      .filter(audit => 
        audit.repoUrl.toLowerCase().includes(lowerQuery) ||
        audit.repoUrl.split('/').slice(-2).join('/').toLowerCase().includes(lowerQuery)
      )
      .slice(0, limit);
  }

  // Get audit statistics grouped by repository
  async getRepositoryStats(): Promise<Array<{
    repoUrl: string;
    repoName: string;
    totalAudits: number;
    lastAudit: string;
    averageScore: number;
    bestScore: number;
  }>> {
    const audits = await this.readAudits();
    const repoMap = new Map<string, AuditResult[]>();

    // Group audits by repository
    audits.forEach(audit => {
      if (!repoMap.has(audit.repoUrl)) {
        repoMap.set(audit.repoUrl, []);
      }
      repoMap.get(audit.repoUrl)!.push(audit);
    });

    // Calculate statistics for each repository
    const stats: Array<{
      repoUrl: string;
      repoName: string;
      totalAudits: number;
      lastAudit: string;
      averageScore: number;
      bestScore: number;
    }> = [];

    repoMap.forEach((repoAudits, repoUrl) => {
      const completedAudits = repoAudits.filter(audit => audit.status === 'completed' && audit.score !== undefined);
      const scores = completedAudits.map(audit => audit.score!);
      
      const averageScore = scores.length > 0 
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
        : 0;
      
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
      
      // Sort by creation date to get the most recent
      const sortedAudits = repoAudits.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      stats.push({
        repoUrl,
        repoName: repoUrl.split('/').slice(-2).join('/'),
        totalAudits: repoAudits.length,
        lastAudit: sortedAudits[0].createdAt,
        averageScore: Math.round(averageScore),
        bestScore,
      });
    });

    // Sort by last audit date (most recent first)
    return stats.sort((a, b) => 
      new Date(b.lastAudit).getTime() - new Date(a.lastAudit).getTime()
    );
  }

  // GitHub App Installation Management
  async storeInstallation(installationData: {
    installationId: number;
    accountType: string;
    accountLogin: string;
    repositorySelection: string;
    permissions: any;
    setupAction?: string;
    createdAt: string;
  }): Promise<GitHubInstallation> {
    const installations = await this.readInstallations();
    
    const newInstallation: GitHubInstallation = {
      id: `install_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      installationId: installationData.installationId,
      accountType: installationData.accountType,
      accountLogin: installationData.accountLogin,
      repositorySelection: installationData.repositorySelection,
      permissions: installationData.permissions,
      setupAction: installationData.setupAction,
      createdAt: installationData.createdAt,
      updatedAt: new Date().toISOString(),
    };

    // Remove existing installation with same installationId
    const filteredInstallations = installations.filter(
      install => install.installationId !== installationData.installationId
    );

    filteredInstallations.unshift(newInstallation);
    await this.writeInstallations(filteredInstallations);
    
    return newInstallation;
  }

  async getInstallation(installationId: number): Promise<GitHubInstallation | null> {
    const installations = await this.readInstallations();
    return installations.find(install => install.installationId === installationId) || null;
  }

  async getInstallations(): Promise<GitHubInstallation[]> {
    return await this.readInstallations();
  }

  async removeInstallation(installationId: number): Promise<boolean> {
    const installations = await this.readInstallations();
    const initialLength = installations.length;
    const filteredInstallations = installations.filter(
      install => install.installationId !== installationId
    );
    
    if (filteredInstallations.length === initialLength) {
      return false; // Installation not found
    }

    await this.writeInstallations(filteredInstallations);
    return true;
  }

  async updateInstallationRepositories(
    installationId: number,
    repositoriesAdded: any[],
    repositoriesRemoved: any[]
  ): Promise<GitHubInstallation | null> {
    const installations = await this.readInstallations();
    const index = installations.findIndex(install => install.installationId === installationId);
    
    if (index === -1) {
      return null;
    }

    installations[index] = {
      ...installations[index],
      updatedAt: new Date().toISOString(),
      repositoriesAdded: repositoriesAdded || [],
      repositoriesRemoved: repositoriesRemoved || [],
    };

    await this.writeInstallations(installations);
    return installations[index];
  }

  // Additional audit methods for improved flow
  async getAuditByRunId(runId: string): Promise<AuditResult | null> {
    const audits = await this.readAudits();
    return audits.find(audit => audit.workflowRunId === runId) || null;
  }

  async getAuditsByStatus(status: string, limit: number = 20): Promise<AuditResult[]> {
    const audits = await this.readAudits();
    return audits
      .filter(audit => audit.status === status)
      .slice(0, limit);
  }
}

export const db = new DatabaseService();