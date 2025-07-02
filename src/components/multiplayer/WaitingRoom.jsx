
import styles from '../../styles/MultiplayerOverlay.module.css';

export default function WaitingRoom({ 
  roomCode, 
  isHost, 
  hasOpponentJoined, 
  onStartGame, 
  onBack,
  roomData
}) {
  return (
    <div className={styles['waiting-room']}>
      <button className={styles['back-button-icon']} onClick={onBack}>
        <img src="/icons/back-button.svg" alt="Back" />
      </button>
      <h2 className={styles.h2}>Waiting Room</h2>
      <div className={styles['room-code-display']}>
        <p className={styles.p}>Share this code with your opponent:</p>
        <div className={styles['room-code']}>{roomCode}</div>
        <button 
          className={styles['copy-button']}
          onClick={() => navigator.clipboard.writeText(roomCode)}
        >
          Copy Code
        </button>
      </div>
      <div className={styles['player-status']}>
        <div className={styles['status-item']}>
          <span className={styles['player-label']}>You:</span>
          <span className={styles['player-role']}>{isHost ? 'Host' : 'Guest'}</span>
        </div>
        <div className={styles['status-item']}>
          <span className={styles['player-label']}>Opponent:</span>
          <span className={`${styles['player-role']} ${hasOpponentJoined ? styles.connected : styles.waiting}`}>
            {hasOpponentJoined ? 'Connected' : 'Waiting...'}
          </span>
        </div>
        {roomData?.players && (
          <div className={styles['players-list']}>
            <p className={styles['players-count']}>Players in room: {roomData.players.length}/2</p>
          </div>
        )}
      </div>
      {isHost && (
        <button 
          className={`${styles['action-button']} ${styles['start-button']}`}
          onClick={onStartGame}
          disabled={!hasOpponentJoined}
        >
          {hasOpponentJoined ? 'START GAME' : 'WAITING FOR OPPONENT'}
        </button>
      )}
      {!isHost && (
        <p className={styles['waiting-message']}>
          {hasOpponentJoined ? 'Ready to start! Waiting for host...' : 'Waiting for host to start the game...'}
        </p>
      )}
      
      {roomData?.players?.length === 1 && (
        <div className={styles['share-reminder']}>
          <p className={styles['reminder-text']}>Share the room code with your friend to get started!</p>
        </div>
      )}

    </div>
  );
}
