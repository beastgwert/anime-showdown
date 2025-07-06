import { useState, useEffect } from 'react';
import styles from '../../styles/MultiplayerGame.module.css';
import MultiplayerCard from './MultiplayerCard';
import characterInfo from '../../character-info.jsx';

// Helper function to create a darker shade of a color
const getDarkerShade = (hexColor, factor = 0.3) => {
  if (!hexColor || hexColor === 'black') return 'rgba(10, 10, 10, 0.9)';

  let r = Math.max(0, Math.floor(parseInt(hexColor.substring(1, 3), 16) * (1 - factor)));
  let g = Math.max(0, Math.floor(parseInt(hexColor.substring(3, 5), 16) * (1 - factor)));
  let b = Math.max(0, Math.floor(parseInt(hexColor.substring(5, 7), 16) * (1 - factor)));
  
  return `rgba(${r}, ${g}, ${b}, 0.9)`;
};

export default function MultiplayerGame({ gameState, playerIndex, onGameEnd, leaveRoom }) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(-1);
  const [playerCards, setPlayerCards] = useState(gameState.players[playerIndex].deck || []);
  const [opponentCards, setOpponentCards] = useState(gameState.players[playerIndex === 0 ? 1 : 0].deck || []);
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)');
  const [showSpecialAbility, setShowSpecialAbility] = useState(false);

  useEffect(() => {
    if (gameState && gameState.players) {
      setCurrentPlayerIndex(gameState.currentPlayerIndex);
      console.log('Game state updated:', gameState);
    }
  }, [gameState]);

  useEffect(() => {
    const myColor = characterInfo.bgColors[playerCards[currentCardIndex]] || '#091023';
    const opponentColor = characterInfo.bgColors[opponentCards[1]] || '#1a1a2e';
        
    const gradient = `linear-gradient(to bottom, ${opponentColor}, ${myColor})`;
    setBackgroundGradient(gradient);
  }, [currentCardIndex, playerCards, opponentCards])

  useEffect(() => {
    if (gameState?.gamePhase === 'ended') {
      setTimeout(() => {
        onGameEnd();
      }, 3000);
    }
  }, [gameState?.gamePhase, onGameEnd]);
  
  const handleOpponentDisconnect = () => {
    leaveRoom();
    onGameEnd();
  };

  const handleSpecialAbility = (cardName) => {
    console.log(`${cardName}'s special ability was used`);
  }

  const handleBasicAttack = (cardName) => {
    console.log(`${cardName}'s basic attack was used`);
  }

  if (!gameState) {
    return (
      <div className={styles['game-layout']}>
        <div className={styles['game-container']} style={{ background: backgroundGradient, transition: 'background 1s ease' }}>
          <div className={styles['loading']}>
            <h2>Loading game...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.gamePhase === 'ended') {
    return (
      <div className={styles['game-layout']}>
        <div className={styles['game-container']} style={{ background: backgroundGradient, transition: 'background 1s ease' }}>
          <div className={styles['game-result']}>
            <h2>Game Over!</h2>
            <p className={styles['result-text']}>
              {gameState.result?.winner === 'player' ? 'You Won!' : 
               gameState.result?.winner === 'opponent' ? 'You Lost!' : 
               'It\'s a Tie!'}
            </p>
            <p className={styles['closing-text']}>Returning to lobby...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (gameState.gamePhase === 'interrupted' && gameState.opponentDisconnected) {
    return (
      <div className={styles['game-layout']}>
        <div className={styles['game-container']} style={{ background: backgroundGradient, transition: 'background 1s ease' }}>
          <div className={styles['game-result']}>
            <h2>Opponent Disconnected</h2>
            <p className={styles['result-text']}>Your opponent has left the game.</p>
            <button 
              className={styles['continue-button']} 
              onClick={handleOpponentDisconnect}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['game-layout']}>
      <div className={styles['game-container']} style={{ background: backgroundGradient, transition: 'background 1s ease' }}>
        <div className={styles['game-header']}>
          <span className={styles['turn-indicator']}>
            {currentPlayerIndex === playerIndex ? 'Your Turn' : 'Waiting for opponent...'}
          </span>
        </div>

        <div className={styles['opponent-area']}>
          {/* <div className={styles['opponent-label']}>Opponent</div> */}
          <div className={styles['cards-container']}>
            {opponentCards.slice(0, 3).map((card, index) => 
              <MultiplayerCard key={index} card={card} isOpponent={true} />
            )}
          </div>
        </div>

        <div className={styles['playing-area']}>
          <div className={styles['dotted-line']}></div>
          <div 
            className={`${styles['ability-display']} ${
                currentCardIndex !== -1 && (!showSpecialAbility || characterInfo.isSpecialAbilityActive[playerCards[currentCardIndex]]) ? 
              styles['ability-display-special'] : ''
            }`}
            style={{ 
              background: currentCardIndex === -1 ? 'black' : getDarkerShade(characterInfo.bgColors[playerCards[currentCardIndex]]),
              cursor: currentCardIndex !== -1 && (!showSpecialAbility || characterInfo.isSpecialAbilityActive[playerCards[currentCardIndex]]) ? 'pointer' : 'default'
            }}
            onClick={() => {
              if (currentCardIndex !== -1 && showSpecialAbility && characterInfo.isSpecialAbilityActive[playerCards[currentCardIndex]]) {
                handleSpecialAbility(playerCards[currentCardIndex]);
              } else if(currentCardIndex !== -1 && !showSpecialAbility) {
                handleBasicAttack(playerCards[currentCardIndex]);
              }
            }}
          >
            {currentCardIndex === -1 ? (
              <div className={styles['vs-text']}>VS</div>
            ) : (
              <>
                {currentCardIndex !== -1 && (
                  <div className={styles['ability-flip-icon']} onClick={(e) => {
                    e.stopPropagation(); 
                    setShowSpecialAbility(!showSpecialAbility);
                  }}>
                    <img src="/icons/ability-flip.svg" alt="Toggle ability" />
                  </div>
                )}
                <div className={styles['ability-title']}>
                  {showSpecialAbility 
                    ? characterInfo.abilities[playerCards[currentCardIndex]][1] // Special ability
                    : characterInfo.abilities[playerCards[currentCardIndex]][0] // Basic attack
                  }
                </div>
                <div className={showSpecialAbility ? styles['ability-description'] : styles['ability-damage']}>
                  {showSpecialAbility 
                    ? characterInfo.multiplayerAbilityDescription[playerCards[currentCardIndex]] || 'No ability description available'
                    : `${characterInfo.abilityDamages[playerCards[currentCardIndex]][0]} - ${characterInfo.abilityDamages[playerCards[currentCardIndex]][1]}`
                  }
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles['player-area']}>
          {/* <div className={styles['player-label']}>Your Cards</div> */}
          <div className={styles['cards-container']}>
            {playerCards.slice(0, 3).map((card, index) => 
              <MultiplayerCard 
                key={index} 
                card={card} 
                isOpponent={false} 
                isSelected={currentCardIndex === index}
                onClick={() => {
                  if (currentCardIndex === index) {
                    setCurrentCardIndex(-1);
                  } else {
                    setCurrentCardIndex(index);
                    setShowSpecialAbility(false);
                  }
                }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
