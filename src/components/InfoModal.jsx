import { useState } from 'react';
import characterInfo from '../character-info.jsx';
import styles from '../styles/InfoModal.module.css';

const InfoModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('rules');
  
  if (!isOpen) return null;

  const playableCharacters = characterInfo.playableCharacters;

  const renderCharactersTab = () => (
    <>
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
    </>
  );

  const renderRulesTab = () => (
    <div className={styles.rulesContent}>
      <div className={styles.rulesSection}>
        <h3>Overview</h3>
        <p>Anime Showdown is a turn-based multiplayer card game where you form a 3-character team to fight your opponent</p>
      </div>

      <div className={styles.rulesSection}>
        <h3>Setup</h3>
        <ul>
          <li>Each player selects 3 characters from the available roster</li>
          <li>Characters have different HP, damage ranges, and unique abilities</li>
        </ul>
      </div>

      <div className={styles.rulesSection}>
        <h3>Gameplay</h3>
        <ul>
          <li><strong>Turn Structure:</strong> Players alternate turns attacking opponent cards</li>
          <li><strong>Attacking:</strong> Click an opponent&apos;s card to attack it with your selected card</li>
          <li><strong>Card Death:</strong> When a character dies, he is effectively removed from the game and his ability no longer applies</li>
        </ul>
      </div>

      <div className={styles.rulesSection}>
        <h3>Abilities</h3>
        <ul>
          <li>Each character has either a passive or active ability (accessed by clicking the bottom right icon in the middle)</li>
          <li><strong>Passive Abilities:</strong> Always active effects (i.e. dodge/crit/paralyze chance, damage reduction)</li>
          <li><strong>Active Abilities:</strong> One-time use abilities (i.e. healing, damage buffs, debuffs)</li>
        </ul>
      </div>

      <div className={styles.rulesSection}>
        <h3>Tips</h3>
        <ul>
          <li>Balance your team with different abilities and HP ranges</li>
          <li>Consider ability synergies when building your loadout</li>
          <li>Target characters with annoying abilities</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Multiplayer </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <img src="/icons/close-button.svg" alt="Close" />
          </button>
        </div>
        
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'rules' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            Rules
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'characters' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('characters')}
          >
            Characters
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'characters' ? renderCharactersTab() : renderRulesTab()}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
