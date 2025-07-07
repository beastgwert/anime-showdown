// LoadoutCard component for character selection
import styles from '../../styles/LoadoutSelection.module.css';
import characterInfo from '../../character-info.jsx';

export default function LoadoutCard({ card, isSelected = false, onClick }) {
  if (!card) return null;
  
  const cardName = card.name || card;
  const imagePath = `/images/${cardName}.webp`;
  
  return (
    <div 
      className={`${styles['loadout-card']} ${isSelected ? styles['selected-card'] : ''}`}
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
  );
}
