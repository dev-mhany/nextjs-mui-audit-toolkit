import { NextResponse } from 'next/server';
import { sanitizeLogData } from './validation';

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  GITHUB_API_ERROR = 'GITHUB_API_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class Logger {
  private static instance: Logger;
  
  private constructor() {}
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  private formatMessage(level: string, message: string, meta?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const sanitizedMeta = meta ? sanitizeLogData(meta) : undefined;
    
    return JSON.stringify({
      timestamp,
      level,
      message,
      meta: sanitizedMeta,
      service: 'nextjs-mui-audit-webapp',
      version: '1.0.0',
    });
  }
  
  info(message: string, meta?: Record<string, unknown>): void {
    console.log(this.formatMessage('info', message, meta));
  }
  
  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(this.formatMessage('warn', message, meta));
  }
  
  error(message: string, error?: Error | Record<string, unknown>, meta?: Record<string, unknown>): void {
    const errorMeta = {
      ...meta,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };
    
    console.error(this.formatMessage('error', message, errorMeta));
  }
  
  debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
  
  // Audit-specific logging methods
  auditStarted(auditId: string, repoUrl: string, userInfo?: Record<string, unknown>): void {
    this.info('Audit started', {
      auditId,
      repoUrl,
      userInfo: sanitizeLogData(userInfo),
    });
  }
  
  auditCompleted(auditId: string, result: Record<string, unknown>): void {
    this.info('Audit completed', {
      auditId,
      result: sanitizeLogData(result),
    });
  }
  
  auditFailed(auditId: string, error: Error, context?: Record<string, unknown>): void {
    this.error('Audit failed', error, {
      auditId,
      context: sanitizeLogData(context),
    });
  }
  
  securityEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' = 'medium'): void {
    this.warn(`Security event: ${event}`, {
      severity,
      details: sanitizeLogData(details),
      timestamp: new Date().toISOString(),
    });
  }
}

export const logger = Logger.getInstance();

// Error response helper
export function createErrorResponse(
  error: Error | AppError | any,
  request?: any
): NextResponse {
  let statusCode = 500;
  let errorCode = ErrorCode.INTERNAL_ERROR;
  let message = 'Internal server error';
  let details: any = undefined;
  
  // Handle known error types
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    errorCode = error.code;
    message = error.message;
    details = error.details;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    errorCode = ErrorCode.VALIDATION_ERROR;
    message = error.message;
    details = { field: error.field };
  } else if (error.name === 'SecurityError') {
    statusCode = 403;
    errorCode = ErrorCode.AUTHORIZATION_ERROR;
    message = error.message;
  } else if (error.message === 'Rate limit exceeded') {
    statusCode = 429;
    errorCode = ErrorCode.RATE_LIMIT_ERROR;
    message = 'Too many requests';
  } else if (error.message?.includes('GitHub')) {
    statusCode = 502;
    errorCode = ErrorCode.GITHUB_API_ERROR;
    message = 'GitHub API error';
    details = { originalError: error.message };
  }
  
  // Log the error
  logger.error('API Error', error, {
    statusCode,
    errorCode,
    url: request?.url,
    method: request?.method,
    userAgent: request?.headers?.get('user-agent'),
    ip: request?.ip,
  });
  
  // Prepare response
  const responseBody: any = {
    error: {
      code: errorCode,
      message,
      timestamp: new Date().toISOString(),
    },
  };
  
  // Add details in development or for validation errors
  if (process.env.NODE_ENV === 'development' || statusCode === 400) {
    if (details) {
      responseBody.error.details = details;
    }
    if (error.stack && process.env.NODE_ENV === 'development') {
      responseBody.error.stack = error.stack;
    }
  }
  
  // Add request ID for tracking
  responseBody.error.requestId = generateRequestId();
  
  return NextResponse.json(responseBody, { status: statusCode });
}

// Global error handler decorator
export function withErrorHandler(handler: Function) {
  return async (request: any, ...args: any[]) => {
    try {
      return await handler(request, ...args);
    } catch (error: any) {
      return createErrorResponse(error, request);
    }
  };
}

// Async error handler for promises
export async function handleAsync<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

// Request ID generation
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Health check utilities
export function createHealthCheck() {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
  };
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  
  startTimer(operation: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(operation, duration);
    };
  }
  
  recordMetric(operation: string, duration: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    
    const operationMetrics = this.metrics.get(operation)!;
    operationMetrics.push(duration);
    
    // Keep only last 100 measurements
    if (operationMetrics.length > 100) {
      operationMetrics.shift();
    }
  }
  
  getMetrics(operation: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
  } | null {
    const operationMetrics = this.metrics.get(operation);
    if (!operationMetrics || operationMetrics.length === 0) {
      return null;
    }
    
    const sorted = [...operationMetrics].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    
    return {
      count,
      average: sum / count,
      min: sorted[0],
      max: sorted[count - 1],
      p95: sorted[Math.floor(count * 0.95)],
    };
  }
  
  getAllMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    
    Array.from(this.metrics.keys()).forEach(operation => {
      result[operation] = this.getMetrics(operation);
    });
    
    return result;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Circuit breaker for external services
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000, // 1 minute
    private monitorTimeout: number = 30000 // 30 seconds
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new AppError(
          'Service temporarily unavailable',
          ErrorCode.NETWORK_ERROR,
          503
        );
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
      logger.warn('Circuit breaker opened', {
        failures: this.failures,
        threshold: this.threshold,
      });
    }
  }
  
  getState(): string {
    return this.state;
  }
}

// Create circuit breaker instances for external services
export const gitHubCircuitBreaker = new CircuitBreaker(3, 60000, 30000);