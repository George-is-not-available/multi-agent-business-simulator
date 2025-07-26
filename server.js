const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      // Parse URL
      const parsedUrl = parse(req.url, true);
      
      // Handle all requests with Next.js
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://172.17.0.10:3000"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Game rooms storage
  const gameRooms = new Map();
  const playerRooms = new Map();

  // Socket.IO event handlers
  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    // Set default player data
    socket.data = {
      playerId: socket.id,
      playerName: `Player_${socket.id.slice(0, 8)}`,
    };

    // Room management events
    socket.on('createRoom', (roomName, maxPlayers) => {
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const room = {
        id: roomId,
        name: roomName,
        players: [],
        gameState: null,
        isStarted: false,
        maxPlayers: Math.min(maxPlayers, 6),
        createdAt: new Date(),
        host: socket.data.playerId
      };

      gameRooms.set(roomId, room);
      joinRoom(socket, roomId);
      console.log(`Room created: ${roomId} by ${socket.data.playerId}`);
    });

    socket.on('joinRoom', (roomId) => {
      joinRoom(socket, roomId);
    });

    socket.on('leaveRoom', (roomId) => {
      leaveRoom(socket, roomId);
    });

    socket.on('listRooms', () => {
      const roomsList = Array.from(gameRooms.values()).filter(room => !room.isStarted);
      socket.emit('roomsList', roomsList);
    });

    socket.on('startGame', (roomId) => {
      startGame(socket, roomId);
    });

    // Game action events
    socket.on('playerAction', (action) => {
      handlePlayerAction(socket, action);
    });

    socket.on('agentCommand', (agentId, command) => {
      handleAgentCommand(socket, agentId, command);
    });

    // Chat events
    socket.on('sendMessage', (roomId, message) => {
      handleChatMessage(socket, roomId, message);
    });

    // Disconnect event
    socket.on('disconnect', () => {
      handleDisconnect(socket);
    });

    // Helper functions
    function joinRoom(socket, roomId) {
      const room = gameRooms.get(roomId);
      if (!room) {
        socket.emit('error', 'Room not found');
        return;
      }

      if (room.players.length >= room.maxPlayers) {
        socket.emit('error', 'Room is full');
        return;
      }

      if (room.isStarted) {
        socket.emit('error', 'Game already started');
        return;
      }

      // Leave current room if any
      if (socket.data.roomId) {
        leaveRoom(socket, socket.data.roomId);
      }

      // Add player to room
      const player = {
        id: socket.data.playerId,
        name: socket.data.playerName,
        company: null,
        isActive: true,
        isOnline: true,
        joinedAt: new Date()
      };

      room.players.push(player);
      socket.data.roomId = roomId;
      playerRooms.set(socket.data.playerId, roomId);

      // Join socket room
      socket.join(roomId);

      // Notify all players in the room
      io.to(roomId).emit('roomUpdated', room);
      socket.emit('roomJoined', room);

      console.log(`Player ${socket.data.playerId} joined room ${roomId}`);
    }

    function leaveRoom(socket, roomId) {
      const room = gameRooms.get(roomId);
      if (!room) return;

      // Remove player from room
      room.players = room.players.filter(p => p.id !== socket.data.playerId);
      socket.leave(roomId);
      
      // Clear player room data
      socket.data.roomId = undefined;
      playerRooms.delete(socket.data.playerId);

      // If room is empty, delete it
      if (room.players.length === 0) {
        gameRooms.delete(roomId);
        console.log(`Room ${roomId} deleted (empty)`);
      } else {
        // If host left, assign new host
        if (room.host === socket.data.playerId && room.players.length > 0) {
          room.host = room.players[0].id;
        }
        
        // Notify remaining players
        io.to(roomId).emit('roomUpdated', room);
      }

      socket.emit('roomLeft', room);
      console.log(`Player ${socket.data.playerId} left room ${roomId}`);
    }

    function startGame(socket, roomId) {
      const room = gameRooms.get(roomId);
      if (!room) {
        socket.emit('error', 'Room not found');
        return;
      }

      if (room.host !== socket.data.playerId) {
        socket.emit('error', 'Only room host can start the game');
        return;
      }

      if (room.players.length < 2) {
        socket.emit('error', 'Need at least 2 players to start');
        return;
      }

      if (room.isStarted) {
        socket.emit('error', 'Game already started');
        return;
      }

      // Initialize game state
      room.isStarted = true;
      room.gameState = initializeGameState(room.players);

      // Notify all players
      io.to(roomId).emit('gameStarted', room.gameState);
      
      console.log(`Game started in room ${roomId}`);
    }

    function initializeGameState(players) {
      // Create companies for each player
      const companies = players.map((player, index) => ({
        id: `company_${player.id}`,
        name: `${player.name} Corp`,
        playerId: player.id,
        assets: 1000000,
        agents: [],
        buildings: [],
        marketPosition: { x: 100 + index * 150, y: 100 + index * 150 },
        organizationType: 'centralized',
        isActive: true,
        color: `hsl(${index * 60}, 70%, 50%)`
      }));

      return {
        companies,
        map: {
          width: 800,
          height: 600,
          buildings: [
            { id: 'trade_center', name: 'International Trade Center', x: 400, y: 200, type: 'trade' },
            { id: 'hospital', name: 'Hospital', x: 200, y: 400, type: 'medical' },
            { id: 'real_estate', name: 'Real Estate Office', x: 600, y: 400, type: 'real_estate' },
            { id: 'hotel', name: 'Hotel', x: 300, y: 300, type: 'hotel' },
            { id: 'apartments', name: 'Apartments', x: 500, y: 300, type: 'residential' }
          ]
        },
        currentTurn: 0,
        gamePhase: 'setup',
        isActive: true,
        startTime: new Date(),
        eliminationStartTime: new Date(Date.now() + 10 * 60 * 1000),
        lastUpdate: new Date()
      };
    }

    function handlePlayerAction(socket, action) {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      const room = gameRooms.get(roomId);
      if (!room || !room.isStarted) return;

      // Broadcast action to all players in room
      io.to(roomId).emit('playerAction', socket.data.playerId, action);
      
      // Update game state
      if (room.gameState) {
        room.gameState.lastUpdate = new Date();
        io.to(roomId).emit('gameStateUpdated', room.gameState);
      }
    }

    function handleAgentCommand(socket, agentId, command) {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      const room = gameRooms.get(roomId);
      if (!room || !room.isStarted) return;

      io.to(roomId).emit('agentMove', agentId, command.position);
    }

    function handleChatMessage(socket, roomId, message) {
      const room = gameRooms.get(roomId);
      if (!room) return;

      const chatMessage = {
        playerId: socket.data.playerId,
        playerName: socket.data.playerName,
        message: message.trim(),
        timestamp: new Date()
      };

      io.to(roomId).emit('chatMessage', chatMessage);
    }

    function handleDisconnect(socket) {
      console.log('Player disconnected:', socket.id);
      
      if (socket.data.roomId) {
        leaveRoom(socket, socket.data.roomId);
      }
    }
  });

  // Start server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log('> Socket.IO server is running');
  });
});