
import styles from '../../styles/DisconnectionNotice.module.css';

export default function DisconnectionNotice({ onContinue, containerClassName = '', backgroundStyle = {} }) {
  return (
    <div className={`${styles['notice-layout']} ${containerClassName}`}>
      <div className={styles['notice-container']} style={backgroundStyle}>
        <div className={styles['notice-content']}>
          <h2>Opponent Disconnected</h2>
          <p className={styles['notice-text']}>Your opponent has left the game.</p>
          <button 
            className={styles['continue-button']} 
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
