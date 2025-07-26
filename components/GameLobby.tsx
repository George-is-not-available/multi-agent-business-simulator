'use client';

import { useState, useEffect } from 'react';
import { getSocketClient } from '@/lib/websocket/client';
import type { GameRoom } from '@/lib/game/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface GameLobbyProps {
  onGameStart: (gameState: any) => void;
}

export default function GameLobby({ onGameStart }: GameLobbyProps) {
  const { language, t } = useLanguage();
  const [socketClient] = useState(() => getSocketClient());
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Set up socket callbacks
    socketClient.setCallbacks({
      onRoomsList: (roomsList) => {
        setRooms(roomsList);
      },
      onRoomJoined: (room) => {
        setCurrentRoom(room);
        setShowCreateRoom(false);
        setError('');
      },
      onRoomLeft: (room) => {
        setCurrentRoom(null);
        socketClient.listRooms(); // Refresh rooms list
      },
      onRoomUpdated: (room) => {
        setCurrentRoom(room);
      },
      onGameStarted: (gameState) => {
        onGameStart(gameState);
      },
      onError: (message) => {
        setError(message);
      }
    });

    // Check connection status
    const checkConnection = () => {
      setIsConnected(socketClient.isConnected());
      if (socketClient.isConnected()) {
        socketClient.listRooms();
      }
    };

    // Connect and start checking
    socketClient.connect();
    checkConnection();

    // Set up periodic connection check
    const interval = setInterval(checkConnection, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [socketClient, onGameStart]);

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      socketClient.createRoom(roomName.trim(), maxPlayers);
      setRoomName('');
    }
  };

  const handleJoinRoom = (roomId: string) => {
    socketClient.joinRoom(roomId);
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      socketClient.leaveRoom(currentRoom.id);
    }
  };

  const handleStartGame = () => {
    if (currentRoom) {
      socketClient.startGame(currentRoom.id);
    }
  };

  const isHost = currentRoom?.host === socketClient.getSocketId();
  const canStartGame = isHost && currentRoom && currentRoom.players.length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            {t.multiplayer.gameTitle}
          </h1>
          <p className="text-xl text-blue-200">{t.multiplayer.multiplayerLobby}</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{isConnected ? t.multiplayer.connected : t.multiplayer.connecting}</span>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 text-center">
            <p className="text-red-200">{error}</p>
            <button 
              onClick={() => setError('')}
              className="mt-2 text-red-400 hover:text-red-300 text-sm"
            >
              {t.multiplayer.dismiss}
            </button>
          </div>
        )}

        {!currentRoom ? (
          // Room selection view
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Rooms */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">{t.multiplayer.availableRooms}</h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rooms.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">{t.multiplayer.noRoomsAvailable}</p>
                ) : (
                  rooms.map((room) => (
                    <div 
                      key={room.id} 
                      className="bg-slate-700/50 rounded-lg p-4 border border-blue-400/20 hover:border-blue-400/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-blue-200">{room.name}</h3>
                          <p className="text-sm text-gray-400">
                            {room.players.length}/{room.maxPlayers} {t.multiplayer.players} • {t.multiplayer.host}: {room.players.find(p => p.id === room.host)?.name}
                          </p>
                        </div>
                        <button
                          onClick={() => handleJoinRoom(room.id)}
                          disabled={room.players.length >= room.maxPlayers}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
                        >
                          {room.players.length >= room.maxPlayers ? t.multiplayer.full : t.multiplayer.join}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => socketClient.listRooms()}
                className="w-full mt-4 py-2 px-4 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors text-sm"
              >
                {t.multiplayer.refresh}
              </button>
            </div>

            {/* Create Room */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">{t.multiplayer.createRoom}</h2>
              
              {!showCreateRoom ? (
                <button
                  onClick={() => setShowCreateRoom(true)}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg transition-all transform hover:scale-105 font-semibold"
                >
                  {t.multiplayer.createNewRoom}
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">{t.multiplayer.roomName}</label>
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="w-full p-3 bg-slate-700 border border-blue-400/30 rounded-lg focus:outline-none focus:border-blue-400 text-white"
                      placeholder={t.multiplayer.enterRoomName}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">{t.multiplayer.maxPlayers}</label>
                    <select
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(Number(e.target.value))}
                      className="w-full p-3 bg-slate-700 border border-blue-400/30 rounded-lg focus:outline-none focus:border-blue-400 text-white"
                    >
                      <option value={2}>2 {t.multiplayer.players}</option>
                      <option value={3}>3 {t.multiplayer.players}</option>
                      <option value={4}>4 {t.multiplayer.players}</option>
                      <option value={5}>5 {t.multiplayer.players}</option>
                      <option value={6}>6 {t.multiplayer.players}</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCreateRoom}
                      disabled={!roomName.trim()}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg transition-all font-semibold"
                    >
                      {t.multiplayer.create}
                    </button>
                    <button
                      onClick={() => setShowCreateRoom(false)}
                      className="flex-1 py-3 px-6 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {t.common.cancel}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Room view
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-blue-300">{currentRoom.name}</h2>
              <button
                onClick={handleLeaveRoom}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                {t.multiplayer.leaveRoom}
              </button>
            </div>

            {/* Players list */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-blue-200 mb-3">{t.multiplayer.players} ({currentRoom.players.length}/{currentRoom.maxPlayers})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentRoom.players.map((player) => (
                  <div
                    key={player.id}
                    className={`bg-slate-700/50 rounded-lg p-3 border ${
                      player.id === currentRoom.host 
                        ? 'border-yellow-400/50 bg-yellow-400/10' 
                        : 'border-blue-400/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white">{player.name}</span>
                      {player.id === currentRoom.host && (
                        <span className="text-yellow-400 text-xs font-medium">{t.multiplayer.host}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${player.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className="text-gray-400 text-xs">{player.isOnline ? t.multiplayer.online : t.multiplayer.offline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game controls */}
            <div className="flex justify-center">
              {isHost ? (
                <button
                  onClick={handleStartGame}
                  disabled={!canStartGame}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg transition-all transform hover:scale-105 font-semibold text-lg"
                >
                  {canStartGame ? t.multiplayer.startGame : t.multiplayer.needMorePlayers}
                </button>
              ) : (
                <p className="text-gray-400 text-center">{t.multiplayer.waitingForHost}</p>
              )}
            </div>

            {/* Game info */}
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>{t.multiplayer.gameWillStart}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}