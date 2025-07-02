
import styles from '../../styles/MultiplayerOverlay.module.css';

export default function MultiplayerOptions({ 
  joinRoomCode, 
  setJoinRoomCode, 
  onCreateRoom, 
  onJoinRoom,
  isConnected
}) {
  return (
    <div className={styles['room-options']}>
      <h2 className={styles.h2}>Multiplayer Options</h2>
      {!isConnected && (
        <div className={styles['connection-status']}>
          <p className={styles['status-text']}>Connecting to server...</p>
        </div>
      )}
      <button 
        className={styles['action-button']} 
        onClick={onCreateRoom}
        disabled={!isConnected}
      >
        CREATE ROOM
      </button>
      <div className={styles['join-section']}>
        <h3 className={styles.h3}>Join Existing Room</h3>
        <div className={styles['join-input-group']}>
          <input
            className={styles.input}
            type="text"
            value={joinRoomCode}
            onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
            placeholder="ROOM CODE"
            maxLength={6}
          />
          <button 
            className={styles['action-button']}
            disabled={joinRoomCode.length !== 6 || !isConnected}
            onClick={onJoinRoom}
          >
            JOIN
          </button>
        </div>
      </div>
    </div>
  );
}
