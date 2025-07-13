/**
 * Socket Client for Multiplayer Anime Card Game
 * Manages socket connection and provides event handling
 */

import { io } from 'socket.io-client';
import { CLIENT_EVENTS, SERVER_EVENTS, CONNECTION_STATUS } from './socketEvents';
import { createApiUrl } from '../config/api';

// Socket instance will be initialized when connect() is called
let socket = null;

// Default event handlers (can be overridden by components)
const defaultHandlers = {
  onConnectionChange: () => {},
  onRoomCreated: () => {},
  onRoomJoined: () => {},
  onRoomUpdated: () => {},
  onPlayerJoined: () => {},
  onPlayerLeft: () => {},
  onGameStarted: () => {},
  onGameStateUpdate: () => {},
  onGameOver: () => {},
  onEndGame: () => {},
  onError: () => {}
};

// Current handlers (initialized with defaults)
let handlers = { ...defaultHandlers };

/**
 * Initializes socket connection to server
 * @param {Object} customHandlers - Event handlers to override defaults
 * @returns {Object} Socket instance
 */
export const connect = (customHandlers = {}) => {
  // Update handlers with any custom ones provided
  handlers = { ...defaultHandlers, ...customHandlers };

  // If socket already exists, return it
  if (socket) return socket;

  // Create new socket connection
  const apiUrl = createApiUrl('');
  socket = io(apiUrl, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  // Set up connection event handlers
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    handlers.onConnectionChange(CONNECTION_STATUS.CONNECTED);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    handlers.onConnectionChange(CONNECTION_STATUS.DISCONNECTED);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    handlers.onConnectionChange(CONNECTION_STATUS.ERROR);
    handlers.onError({ type: 'connection', message: 'Failed to connect to server' });
  });

  // Set up game event handlers
  socket.on(SERVER_EVENTS.ROOM_CREATED, (data) => {
    console.log('Room created:', data);
    handlers.onRoomCreated(data);
  });

  socket.on(SERVER_EVENTS.ROOM_JOINED, (data) => {
    console.log('Room joined:', data);
    handlers.onRoomJoined(data);
  });

  socket.on(SERVER_EVENTS.ROOM_UPDATED, (data) => {
    console.log('Room updated:', data);
    handlers.onRoomUpdated(data);
  });

  socket.on(SERVER_EVENTS.PLAYER_JOINED, (data) => {
    console.log('Player joined:', data);
    handlers.onPlayerJoined(data);
  });

  socket.on(SERVER_EVENTS.PLAYER_LEFT, (data) => {
    console.log('Player left:', data);
    handlers.onPlayerLeft(data);
  });

  socket.on(SERVER_EVENTS.GAME_STARTED, (data) => {
    console.log('Game started:', data);
    handlers.onGameStarted(data);
  });

  socket.on(SERVER_EVENTS.PLAYING_STARTED, (data) => {
    console.log('Playing started:', data);
    // Use existing onGameStateUpdate handler to update game state
    handlers.onGameStateUpdate(data);
  });

  socket.on(SERVER_EVENTS.GAME_STATE_UPDATE, (data) => {
    // Don't log full game state as it could be large
    console.log('Game state updated');
    handlers.onGameStateUpdate(data);
  });
  
  socket.on(SERVER_EVENTS.SWITCH_TURN, (data) => {
    console.log('Turn switched');
    handlers.onGameStateUpdate(data);
  });

  socket.on(SERVER_EVENTS.GAME_OVER, (data) => {
    console.log('Game over:', data);
    handlers.onGameOver(data);
  });
  
  socket.on(SERVER_EVENTS.END_GAME, (data) => {
    console.log('Game ended:', data);
    handlers.onEndGame(data);
  });

  socket.on(SERVER_EVENTS.ROOM_ERROR, (data) => {
    console.error('Room error:', data);
    handlers.onError(data);
  });

  socket.on(SERVER_EVENTS.GAME_ERROR, (data) => {
    console.error('Game error:', data);
    handlers.onError(data);
  });

  return socket;
};

/**
 * Updates event handlers
 * @param {Object} newHandlers - New event handlers
 */
export const updateHandlers = (newHandlers) => {
  handlers = { ...handlers, ...newHandlers };
};

/**
 * Creates a new game room
 */
export const createRoom = () => {
  if (!socket || !socket.connected) {
    handlers.onError({ type: 'connection', message: 'Not connected to server' });
    return;
  }
  
  socket.emit(CLIENT_EVENTS.CREATE_ROOM);
};

/**
 * Joins an existing game room
 * @param {string} roomId - Room code to join
 */
export const joinRoom = (roomId) => {
  if (!socket || !socket.connected) {
    handlers.onError({ type: 'connection', message: 'Not connected to server' });
    return;
  }
  
  socket.emit(CLIENT_EVENTS.JOIN_ROOM, { roomId });
};

/**
 * Leaves the current game room
 */
export const leaveRoom = () => {
  if (!socket || !socket.connected) return;
  
  socket.emit(CLIENT_EVENTS.LEAVE_ROOM);
};

/**
 * Starts the game (host only)
 */
export const startGame = () => {
  if (!socket || !socket.connected) {
    handlers.onError({ type: 'connection', message: 'Not connected to server' });
    return;
  }
  
  socket.emit(CLIENT_EVENTS.START_GAME);
};

/**
 * Confirms player loadout selection
 * @param {Array} loadout - Array of selected character names
 */
export const confirmLoadout = (loadout) => {
  if (!socket || !socket.connected) {
    handlers.onError({ type: 'connection', message: 'Not connected to server' });
    return;
  }
  
  socket.emit(CLIENT_EVENTS.CONFIRM_LOADOUT, { loadout });
};

/**
 * Sends a game action to the server
 * @param {Object} action - Action data
 */
export const sendGameAction = (action) => {
  if (!socket || !socket.connected) {
    handlers.onError({ type: 'connection', message: 'Not connected to server' });
    return;
  }
  
  socket.emit(CLIENT_EVENTS.GAME_ACTION, { action });
};

/**
 * Notifies server that game action animation has finished
 */
export const sendGameActionFinished = () => {
  if (!socket || !socket.connected) {
    handlers.onError({ type: 'connection', message: 'Not connected to server' });
    return;
  }
  
  socket.emit(CLIENT_EVENTS.GAME_ACTION_FINISHED);
};

/**
 * Notifies server that the game should end (all player cards are dead)
 */
export const sendGameEnd = () => {
  if (!socket || !socket.connected) {
    handlers.onError({ type: 'connection', message: 'Not connected to server' });
    return;
  }
  
  socket.emit(CLIENT_EVENTS.GAME_END);
};

/**
 * Disconnects socket from server
 */
export const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Gets current connection status
 * @returns {string} Connection status
 */
export const getConnectionStatus = () => {
  if (!socket) return CONNECTION_STATUS.DISCONNECTED;
  return socket.connected ? CONNECTION_STATUS.CONNECTED : CONNECTION_STATUS.DISCONNECTED;
};

/**
 * Gets socket ID if connected
 * @returns {string|null} Socket ID or null if not connected
 */
export const getSocketId = () => {
  return socket?.id || null;
};

export default {
  connect,
  disconnect,
  createRoom,
  joinRoom,
  leaveRoom,
  startGame,
  confirmLoadout,
  sendGameAction,
  sendGameActionFinished,
  sendGameEnd,
  updateHandlers,
  getConnectionStatus,
  getSocketId
};
