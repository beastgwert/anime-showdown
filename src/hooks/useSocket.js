/**
 * Custom hook for managing Socket.io connections in React components
 */

import { useState, useEffect, useCallback } from 'react';
import socketClient from '../socket/socketClient';
import { CONNECTION_STATUS } from '../socket/socketEvents';

/**
 * Hook for managing socket connections and event handling
 * @param {Object} initialHandlers - Initial event handlers
 * @returns {Object} Socket methods and state
 */
const useSocket = (initialHandlers = {}) => {
  // Connection status state
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.DISCONNECTED);
  
  // Room state
  const [roomData, setRoomData] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [playerIndex, setPlayerIndex] = useState(null);
  const [error, setError] = useState(null);
  
  // Game state
  const [gameState, setGameState] = useState(null);
   
  // Connect to socket on component mount
  useEffect(() => {
    // Define handlers
    const handlers = {
      onConnectionChange: (status) => {
        setConnectionStatus(status);
        if (status === CONNECTION_STATUS.DISCONNECTED) {
          setRoomData(null);
          setGameState(null);
          setPlayerIndex(null);
        }
      },
      onRoomCreated: (data) => {
        setRoomData({ roomId: data.roomId, players: [{ socketId: socketClient.getSocketId(), isHost: true, playerIndex: data.playerIndex }] });
        setIsHost(true);
        setPlayerIndex(data.playerIndex);
        setError(null);
      },
      onRoomJoined: (data) => {
        setRoomData({ roomId: data.roomId, players: [] });
        setIsHost(data.isHost);
        setPlayerIndex(data.playerIndex);
        setError(null);
      },
      onRoomUpdated: (data) => {
        setRoomData(data);
      },
      onPlayerJoined: (data) => {
        setRoomData((prevData) => {
          if (!prevData) return null;
          
          // Add player to room data if not already present
          const playerExists = prevData.players?.some(p => p.socketId === data.socketId);
          
          if (!playerExists) {
            return {
              ...prevData,
              players: [...(prevData.players || []), { socketId: data.socketId, isHost: false }]
            };
          }
          
          return prevData;
        });
      },
      onPlayerLeft: (data) => {
        if (gameState && (gameState.gamePhase === 'loadout' || gameState.gamePhase === 'active')) { // update game state to display disconnect message if game has already started
          setGameState((prevState) => ({
            ...prevState,
            gamePhase: 'interrupted',
            opponentDisconnected: true
          }));
        } else { // handle player leaving waiting room 
          setRoomData((prevData) => {
            if (!prevData) return null;
            
            const updatedRoomData = {
              ...prevData,
              ...data.room
            };
            
            // Check if current player is now the host
            const currentSocketId = socketClient.getSocketId();
            const currentPlayer = updatedRoomData.players?.find(p => p.socketId === currentSocketId);
            if (currentPlayer) {
              setIsHost(currentPlayer.isHost);
            }
            
            return updatedRoomData;
          });
        }
      },
      onGameStarted: (data) => {
        setGameState(data.gameState);
      },
      onPlayingStarted: (data) => {
        // Update game state and set game phase to active
        setGameState((prevState) => ({
          ...prevState,
          ...data,
          gamePhase: 'active'
        }));
      },
      onGameStateUpdate: (data) => {
        setGameState(data);
      },
      onGameOver: (data) => {
        setGameState((prevState) => ({
          ...prevState,
          gamePhase: 'ended',
          result: data.result
        }));
      },
      onEndGame: (data) => {
        setGameState(data.gameState);
        console.log('Game ended:', data);
      },
      onError: (data) => {
        setError(data.error || 'Unknown error');
      },
      ...initialHandlers
    };
    
    // Connect to socket with handlers
    socketClient.connect(handlers);
    
    // Set initial connection status
    setConnectionStatus(socketClient.getConnectionStatus());
    
    // Cleanup on unmount
    return () => {
      // Don't disconnect, just remove handlers
      socketClient.updateHandlers({});
    };
  }, [initialHandlers, gameState]);
  
  // Socket actions
  const createRoom = useCallback(() => {
    setError(null);
    socketClient.createRoom();
  }, []);
  
  const joinRoom = useCallback((roomId) => {
    setError(null);
    socketClient.joinRoom(roomId);
  }, []);
  
  const leaveRoom = useCallback(() => {
    socketClient.leaveRoom();
    setRoomData(null);
    setGameState(null);
    setPlayerIndex(null);
  }, []);
  
  const startGame = useCallback(() => {
    if (!isHost) {
      setError('Only host can start the game');
      return;
    }
    socketClient.startGame();
  }, [isHost]);
  
  const confirmLoadout = useCallback((loadout) => {
    socketClient.confirmLoadout(loadout);
  }, []);
  
  const sendGameAction = useCallback((action) => {
    if (roomData) {
      socketClient.sendGameAction(action);
    }
  }, [roomData]);
  
  const sendGameActionFinished = useCallback(() => {
    if (roomData) {
      socketClient.sendGameActionFinished();
    }
  }, [roomData]);
  
  return {
    // State
    connectionStatus,
    roomData,
    isHost,
    playerIndex,
    gameState,
    error,
    socketId: socketClient.getSocketId(),
    
    // Actions
    connect: socketClient.connect,
    disconnect: socketClient.disconnect,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    confirmLoadout,
    sendGameAction,
    sendGameActionFinished,
    
    // Helpers
    isConnected: connectionStatus === CONNECTION_STATUS.CONNECTED,
    isInRoom: !!roomData,
    isGameActive: gameState?.gamePhase === 'playing'
  };
};

export default useSocket;
