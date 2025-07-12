import styles from '../../styles/MultiplayerGame.module.css';
import characterInfo from '../../character-info.jsx';

export default function MultiplayerCard({ card, isOpponent = false, isSelected = false, onClick, showHP = true, isTargetable = false }) {
  if (!card) return null;
  
  const cardName = card.name || card;
  const imagePath = `/images/${cardName}.webp`;
  
  // Get HP from character info (first element in health array)
  const maxHP = characterInfo.health[cardName] ? characterInfo.health[cardName][0] : 100;
  const currentHP = maxHP; // For now, assume full HP - this can be dynamic later
  const hpPercentage = (currentHP / maxHP) * 100;
  
  // Determine HP bar color based on percentage
  let hpColor;
  if (hpPercentage > 66.67) {
    hpColor = '#44ff44'; // Green
  } else if (hpPercentage > 33.33) {
    hpColor = '#ffaa00'; // Orange
  } else {
    hpColor = '#ff4444'; // Red
  }
  
  return (
    <div className={showHP ? styles['card-with-hp'] : ''}>
      <div 
        className={`${styles['card']} ${isOpponent ? styles['opponent-card'] : styles['player-card']} ${isSelected ? styles['selected-card'] : ''} ${isTargetable ? styles['targetable-card'] : ''}`}
        onClick={onClick ? () => onClick() : undefined}
        style={{background: `linear-gradient(to bottom, ${characterInfo.bgColors[cardName] || '#6a5acd'}, #150911)`}}
      >
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
      {showHP && (
        <div className={styles['hp-bar-container']}>
          <div className={styles['hp-bar']}>
            <div 
              className={styles['hp-bar-fill']} 
              style={{ width: `${hpPercentage}%`, backgroundColor: hpColor }}
            ></div>
            <div className={styles['hp-text']}>
              {currentHP}/{maxHP}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
