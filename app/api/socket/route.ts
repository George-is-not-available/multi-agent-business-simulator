import { NextRequest } from 'next/server';
import { Server as NetServer } from 'http';
import { Server as ServerIO } from 'socket.io';
import { GameSocketServer } from '@/lib/websocket/server';

export const dynamic = 'force-dynamic';

// Store the socket server instance
let io: ServerIO;
let gameServer: GameSocketServer;

export async function GET(req: NextRequest) {
  if (!io) {
    // Create HTTP server from Next.js
    const httpServer = req.socket?.server as any;
    
    if (httpServer && !httpServer.io) {
      // Create Socket.IO server
      io = new ServerIO(httpServer, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
          origin: ["http://localhost:3000", "http://172.17.0.10:3000"],
          methods: ["GET", "POST"],
          credentials: true
        }
      });

      // Initialize game server
      gameServer = new GameSocketServer(io);
      httpServer.io = io;

      console.log('Socket.IO server initialized');
    }
  }

  return new Response('Socket.IO server running', { status: 200 });
}

// Export the socket server for external access
export function getSocketServer(): GameSocketServer | null {
  return gameServer || null;
}