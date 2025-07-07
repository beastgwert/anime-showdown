import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from '../../styles/LoadoutSelection.module.css';
import LoadoutCard from './LoadoutCard';
import characterInfo from '../../character-info.jsx';

export default function LoadoutSelection({ onConfirmLoadout, roomCode }) {
  // Use playableCharacters from character-info.jsx
  const playableCharacters = characterInfo.playableCharacters;
  
  // Default loadout: first 3 elements of playableCharacters
  const [selectedLoadout, setSelectedLoadout] = useState(playableCharacters.slice(0, 3));
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // Track which loadout slot is selected for replacement
  
  // Get all playable characters from character-info
  const allCharacters = playableCharacters;
  
  // Available characters for selection (excluding current loadout)
  const availableCharacters = allCharacters.filter(char => !selectedLoadout.includes(char));
  
  const handleCardClick = (character) => {
    if (isConfirmed) return; // Can't change after confirmation
    
    // If clicking a character in loadout, do nothing (they can't remove from loadout directly)
    if (selectedLoadout.includes(character)) return;
    
    // If a slot is selected, replace that slot; otherwise replace the first slot
    const slotToReplace = selectedSlot !== null ? selectedSlot : 0;
    const newLoadout = [...selectedLoadout];
    newLoadout[slotToReplace] = character;
    setSelectedLoadout(newLoadout);
    setSelectedSlot(null); // Clear selection after replacement
  };
  
  const handleLoadoutSlotClick = (index) => {
    if (isConfirmed) return; // Can't change after confirmation
    
    // Toggle slot selection
    setSelectedSlot(selectedSlot === index ? null : index);
  };
  
  const handleConfirm = () => {
    setIsConfirmed(true);
    onConfirmLoadout(selectedLoadout);
  };
  
  const slideLeft = () => {
    const slider = document.getElementById('character-slider');
    slider.scrollLeft = slider.scrollLeft - 200;
  };

  const slideRight = () => {
    const slider = document.getElementById('character-slider');
    slider.scrollLeft = slider.scrollLeft + 200;
  };
  
  return (
    <div className={styles['loadout-layout']}>
      <div className={styles['loadout-container']}>
      <div className={styles['loadout-header']}>
        <h2>Choose Your Loadout</h2>
        <p className={styles['room-code']}>Room: {roomCode}</p>
      </div>
      
      {/* Current Loadout Display */}
      <div className={styles['current-loadout']}>
        <h3>Your Team</h3>
        {!isConfirmed && (
          <p className={styles['instruction-text']}>
            {selectedSlot !== null 
              ? `Click a character below to replace slot ${selectedSlot + 1}` 
              : 'Click a team member to select which slot to replace'}
          </p>
        )}
        <div className={styles['loadout-cards']}>
          {selectedLoadout.map((character, index) => (
            <div key={index} className={`${styles['loadout-slot']} ${selectedSlot === index ? styles['selected-slot'] : ''}`}>
              <LoadoutCard 
                card={character}
                onClick={() => handleLoadoutSlotClick(index)}
                isSelected={selectedSlot === index}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Available Characters */}
      <div className={styles['character-selection']}>
        <h3>Available Characters</h3>
        <div className={styles['character-slider-container']}>
          <FaChevronLeft 
            className={styles['slider-arrow']} 
            onClick={slideLeft}
          />
          <div id='character-slider' className={styles['character-slider']}>
            {availableCharacters.map((character) => (
              <div key={character} className={styles['character-option']}>
                <LoadoutCard 
                  card={character}
                  onClick={() => handleCardClick(character)}
                />
              </div>
            ))}
          </div>
          <FaChevronRight 
            className={styles['slider-arrow']} 
            onClick={slideRight}
          />
        </div>
      </div>
      
      {/* Confirm Button */}
      <div className={styles['confirm-section']}>
        <button 
          className={`${styles['confirm-button']} ${isConfirmed ? styles['confirmed'] : ''}`}
          onClick={handleConfirm}
          disabled={isConfirmed}
        >
          {isConfirmed ? 'Loadout Confirmed ✓' : 'Confirm Loadout'}
        </button>
        {isConfirmed && (
          <p className={styles['waiting-message']}>
            Waiting for opponent to confirm their loadout...
          </p>
        )}
      </div>
      </div>
    </div>
  );
}
