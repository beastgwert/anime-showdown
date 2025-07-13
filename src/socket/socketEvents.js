/**
 * Socket Event Constants for Multiplayer Anime Card Game
 * Centralizes all event names to avoid typos and maintain consistency
 */

// Client → Server events
export const CLIENT_EVENTS = {
  CREATE_ROOM: 'create-room',
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  START_GAME: 'start-game',
  CONFIRM_LOADOUT: 'confirm-loadout',
  GAME_ACTION: 'game-action',
  GAME_ACTION_FINISHED: 'game-action-finished',
  TURN_END: 'turn-end'
};

// Server → Client events
export const SERVER_EVENTS = {
  ROOM_CREATED: 'room-created',
  ROOM_JOINED: 'room-joined',
  ROOM_UPDATED: 'room-updated',
  PLAYER_JOINED: 'player-joined',
  PLAYER_LEFT: 'player-left',
  GAME_STARTED: 'game-started',
  LOADOUT_CONFIRMED: 'loadout-confirmed',
  PLAYING_STARTED: 'playing-started',
  GAME_STATE_UPDATE: 'game-state-update',
  PLAYER_TURN: 'player-turn',
  SWITCH_TURN: 'switch-turn',
  GAME_OVER: 'game-over',
  ROOM_ERROR: 'room-error',
  GAME_ERROR: 'game-error'
};

// Connection status
export const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  ERROR: 'error'
};
