import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { activityLogs } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Get recent activity logs
    const logs = await db.query.activityLogs.findMany({
      orderBy: desc(activityLogs.timestamp),
      limit: 100
    });

    // Transform activity logs to system log format
    const systemLogs = logs.map((log, index) => ({
      id: log.id,
      level: getLogLevel(log.action),
      message: formatLogMessage(log.action, log.metadata),
      timestamp: log.timestamp,
      category: getLogCategory(log.action)
    }));

    // Add some mock system logs for demonstration
    const mockSystemLogs = [
      {
        id: 9999,
        level: 'info' as const,
        message: 'WebSocket server started successfully',
        timestamp: new Date(),
        category: 'SYSTEM'
      },
      {
        id: 9998,
        level: 'info' as const,
        message: 'Database connection established',
        timestamp: new Date(Date.now() - 60000),
        category: 'DATABASE'
      },
      {
        id: 9997,
        level: 'warning' as const,
        message: 'High memory usage detected (75%)',
        timestamp: new Date(Date.now() - 120000),
        category: 'SYSTEM'
      }
    ];

    const allLogs = [...mockSystemLogs, ...systemLogs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);

    return NextResponse.json({
      logs: allLogs
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

function getLogLevel(action: string): 'info' | 'warning' | 'error' {
  if (action.includes('error') || action.includes('failed')) {
    return 'error';
  }
  if (action.includes('warning') || action.includes('timeout')) {
    return 'warning';
  }
  return 'info';
}

function formatLogMessage(action: string, metadata: string | null): string {
  const base = action.replace('_', ' ').toUpperCase();
  if (metadata) {
    try {
      const parsed = JSON.parse(metadata);
      if (parsed.error) {
        return `${base}: ${parsed.error}`;
      }
      if (parsed.details) {
        return `${base}: ${parsed.details}`;
      }
    } catch {
      // If metadata isn't valid JSON, just return the base message
    }
  }
  return base;
}

function getLogCategory(action: string): string {
  if (action.includes('login') || action.includes('register')) {
    return 'AUTH';
  }
  if (action.includes('game') || action.includes('room')) {
    return 'GAME';
  }
  if (action.includes('user')) {
    return 'USER';
  }
  if (action.includes('admin')) {
    return 'ADMIN';
  }
  return 'SYSTEM';
}