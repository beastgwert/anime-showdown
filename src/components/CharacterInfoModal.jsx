import characterInfo from '../character-info.jsx';
import styles from '../styles/CharacterInfoModal.module.css';

const CharacterInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const playableCharacters = characterInfo.playableCharacters;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Character Information</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <img src="/icons/close-button.svg" alt="Close" />
          </button>
        </div>
        
        <div className={styles.charactersGrid}>
          {playableCharacters.map((character) => (
            <div key={character} className={styles.characterCard}>
              <h3 className={styles.characterName}>{character}</h3>
              
              <div className={styles.characterStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>HP:</span>
                  <span className={styles.statValue}>{characterInfo.maxHP[character]}</span>
                </div>
                
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Damage:</span>
                  <span className={styles.statValue}>
                    {characterInfo.abilityDamages[character][0]} - {characterInfo.abilityDamages[character][1]}
                  </span>
                </div>
              </div>

              <div className={styles.abilities}>
                {characterInfo.multiplayerAbilityDescription[character] && (
                  <div className={styles.abilitySection}>
                    <h4 className={styles.abilityTitle}>{characterInfo.abilities[character][1]}:</h4>
                    <p className={styles.abilityDescription}>
                      {characterInfo.multiplayerAbilityDescription[character]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterInfoModal;
