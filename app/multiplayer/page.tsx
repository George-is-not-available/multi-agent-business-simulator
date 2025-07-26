'use client';

import { useState, useCallback, useEffect } from 'react';
import GameLobby from '@/components/GameLobby';
import Game from '@/components/Game'; // Assuming we'll update the existing game component
import { useLanguage } from '@/lib/i18n/LanguageContext';
import useGamePersistence from '@/lib/game/useGamePersistence';
import GameChat from '@/components/GameChat';

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
  const [chatMinimized, setChatMinimized] = useState(false);
  const { saveGameState, loadGameState, isSaving, error, lastSaved } = useGamePersistence(initialGameState.currentRoomId || '');

  // Auto-save game state every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.isActive) {
        saveGameState(gameState);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [gameState, saveGameState]);

  // Save game state when the game ends
  useEffect(() => {
    if (!gameState.isActive && gameState.winner) {
      saveGameState(gameState);
    }
  }, [gameState.isActive, gameState.winner, saveGameState]);
  
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
                
                {/* Save status */}
                <div className="flex items-center space-x-2 text-xs">
                  {isSaving && (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-400"></div>
                      <span className="text-blue-400">Saving...</span>
                    </>
                  )}
                  {!isSaving && lastSaved && (
                    <>
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400">Auto-saved</span>
                    </>
                  )}
                  {error && (
                    <>
                      <div className="h-2 w-2 bg-red-400 rounded-full"></div>
                      <span className="text-red-400">Save failed</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Chat System */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/30">
              <GameChat
                roomId={gameState.currentRoomId || 'multiplayer'}
                className="h-64"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}