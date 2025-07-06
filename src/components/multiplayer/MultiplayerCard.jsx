import styles from '../../styles/MultiplayerGame.module.css';

export default function MultiplayerCard({ card, isOpponent = false }) {
  if (!card) return null;
  
  const cardName = card.name || card;
  const imagePath = `/images/${cardName}.webp`;
  
  return (
    <div className={`${styles['card']} ${isOpponent ? styles['opponent-card'] : styles['player-card']}`}>
      <div className={styles['card-image']}>
        <img 
          src={imagePath} 
          alt={cardName}
          onError={(e) => {
            // Fallback if image doesn't exist
            e.target.style.display = 'none';
          }}
        />
      </div>
      <div className={styles['card-name']}>
        {cardName}
      </div>
    </div>
  );
}
