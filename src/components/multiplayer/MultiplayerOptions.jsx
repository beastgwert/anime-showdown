
import styles from '../../styles/MultiplayerOverlay.module.css';

export default function MultiplayerOptions({ 
  joinRoomCode, 
  setJoinRoomCode, 
  handleCreateRoom, 
  handleJoinRoom 
}) {
  return (
    <div className={styles['room-options']}>
      <h2 className={styles.h2}>Multiplayer Options</h2>
      <button className={styles['action-button']} onClick={handleCreateRoom}>
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
            disabled={joinRoomCode.length !== 6}
            onClick={handleJoinRoom}
          >
            JOIN
          </button>
        </div>
      </div>
    </div>
  );
}
