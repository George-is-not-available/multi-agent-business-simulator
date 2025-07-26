'use client';

import { useState, useCallback } from 'react';
import GameLobby from '@/components/GameLobby';
import Game from '@/components/Game'; // Assuming we'll update the existing game component
import { useLanguage } from '@/lib/i18n/LanguageContext';

import type { GameState } from '@/lib/game/types';

type GameMode = 'lobby' | 'game' | 'loading';

export default function MultiplayerPage() {
  const { language } = useLanguage();
  const [gameMode, setGameMode] = useState<GameMode>('lobby');
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleGameStart = useCallback((initialGameState: GameState) => {
    setGameState(initialGameState);
    setGameMode('game');
  }, []);

  const handleBackToLobby = useCallback(() => {
    setGameMode('lobby');
    setGameState(null);
  }, []);

  const handleGameEnd = useCallback(() => {
    // Game ended, show results and then go back to lobby
    setTimeout(() => {
      setGameMode('lobby');
      setGameState(null);
    }, 3000); // Show results for 3 seconds
  }, []);

  return (
    <div className="relative min-h-screen">


      {/* Main content */}
      {gameMode === 'lobby' && (
        <GameLobby onGameStart={handleGameStart} />
      )}

      {gameMode === 'game' && gameState && (
        <div className="relative">
          {/* Back to lobby button */}
          <button
            onClick={handleBackToLobby}
            className="fixed top-4 left-4 z-40 px-4 py-2 bg-red-600/80 hover:bg-red-700/80 backdrop-blur-sm rounded-lg transition-colors text-white font-medium"
          >
            ← Back to Lobby
          </button>
          
          {/* Game component - we'll need to update this to work with multiplayer */}
          <MultiplayerGame 
            initialGameState={gameState}
            onGameEnd={handleGameEnd}
          />
        </div>
      )}

      {gameMode === 'loading' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
            <p className="text-white text-xl mt-4">Loading game...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Multiplayer-enabled Game component
interface MultiplayerGameProps {
  initialGameState: GameState;
  onGameEnd: () => void;
}

function MultiplayerGame({ initialGameState, onGameEnd }: MultiplayerGameProps) {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState(initialGameState);

  // This is a placeholder - we'll need to integrate this with the WebSocket system
  // and the existing game logic
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            {t.multiplayer.gameTitle}
          </h1>
          <p className="text-blue-200 mt-2">Multiplayer Business Competition</p>
        </div>

        {/* Game area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main game view */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
              <h2 className="text-xl font-semibold text-blue-300 mb-4">Game Map</h2>
              
              {/* Game map will be rendered here */}
              <div className="bg-slate-700/50 rounded-lg h-96 flex items-center justify-center">
                <p className="text-gray-400">Game map will be implemented here</p>
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-6">
            {/* Players */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Players</h3>
              <div className="space-y-2">
                {gameState.companies.map((company) => (
                  <div 
                    key={company.id}
                    className="bg-slate-700/50 rounded p-3 border border-blue-400/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{company.name}</span>
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: company.color }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Assets: ${company.assets.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      Status: {company.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Game controls */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Game Info</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">Turn: {gameState.currentTurn}</p>
                <p className="text-gray-300">Phase: {gameState.gamePhase}</p>
                <p className="text-gray-300">Active: {gameState.isActive ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Chat (placeholder) */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Chat</h3>
              <div className="bg-slate-700/50 rounded h-32 mb-3 p-2 overflow-y-auto">
                <p className="text-gray-400 text-sm">Chat messages will appear here</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t.multiplayer.typeMessage}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-blue-400/30 rounded text-white text-sm"
                />
                <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm">
                  {t.multiplayer.sendMessage}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}