/**
 * Centralized logging utility to replace console.log statements
 * Provides structured logging with different levels
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };
  }

  private output(entry: LogEntry): void {
    const logString = JSON.stringify(entry);
    
    switch (entry.level) {
      case 'error':
        console.error(logString);
        break;
      case 'warn':
        console.warn(logString);
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(logString);
        }
        break;
      default:
        console.log(logString);
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.output(this.formatLog('info', message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.output(this.formatLog('warn', message, context));
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
        name: error.name,
      } : error,
    };
    this.output(this.formatLog('error', message, errorContext));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.output(this.formatLog('debug', message, context));
  }
}

export const logger = new Logger();
