import styles from '../../styles/MultiplayerGame.module.css';
import characterInfo from '../../character-info.jsx';

export default function MultiplayerCard({ card, isOpponent = false, isSelected = false, onClick, showHP = true, isTargetable = false, currentHP, maxHP, isDead = false, hasAnyaProtection = false, hasMakimaDistribution = false, hasBurnEffect = false }) {
  if (!card) return null;
  
  const cardName = card.name || card;
  const imagePath = `/images/${cardName}.webp`;
  
  // Use provided HP values or fallback to character info
  const cardMaxHP = maxHP || (characterInfo.health[cardName] ? characterInfo.health[cardName][0] : 100);
  const cardCurrentHP = currentHP !== undefined ? currentHP : cardMaxHP;
  const hpPercentage = (cardCurrentHP / cardMaxHP) * 100;
  
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
        className={`${styles['card']} ${isOpponent ? styles['opponent-card'] : styles['player-card']} ${isSelected ? styles['selected-card'] : ''} ${isTargetable && !isDead ? styles['targetable-card'] : ''} ${isDead ? styles['dead-card'] : ''} ${hasAnyaProtection ? styles['anya-protection'] : ''} ${hasMakimaDistribution ? styles['makima-distribution'] : ''} ${hasBurnEffect ? styles['burn-effect'] : ''}`}
        onClick={!isDead && onClick ? () => onClick() : undefined}
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
              {cardCurrentHP}/{cardMaxHP}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
