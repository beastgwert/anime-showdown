import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DisconnectionNotice from './DisconnectionNotice';
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

export default function MultiplayerGame({ gameState, playerIndex, sendGameAction, sendGameActionFinished, onGameEnd, handleOpponentDisconnect}) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(-1);
  const [playerCards, setPlayerCards] = useState(gameState.players[playerIndex].deck || []);
  const [opponentCards, setOpponentCards] = useState(gameState.players[playerIndex === 0 ? 1 : 0].deck || []);
  // Initialize HP for player's cards based on character info
  const [playerHP, setPlayerHP] = useState(() => {
    const initialDeck = gameState.players[playerIndex].deck || [];
    return initialDeck.map(cardName => characterInfo.maxHP?.[cardName] || 1000);
  });
  // Initialize HP for opponent's cards based on character info
  const [opponentHP, setOpponentHP] = useState(() => {
    const opponentIndex = playerIndex === 0 ? 1 : 0;
    const initialDeck = gameState.players[opponentIndex].deck || [];
    return initialDeck.map(cardName => characterInfo.maxHP?.[cardName] || 1000);
  });
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)');
  const [showSpecialAbility, setShowSpecialAbility] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackAnimation, setAttackAnimation] = useState(null);
  const [damageDealt, setDamageDealt] = useState(null);
  
  // Refs for card positions
  const playerCardRefs = useRef([]);
  const opponentCardRefs = useRef([]);

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

  const handleSpecialAbility = (cardName) => {
    console.log(`${cardName}'s special ability was used`);
  }

  const startAttackAnimation = useCallback((attackingCardIndex, targetCardIndex) => {
    const attackingCard = playerCards[attackingCardIndex];
    const targetCard = opponentCards[targetCardIndex];
    
    // Use damage from gameState (calculated on server)
    const damage = gameState?.damageDealt || 0;
    
    console.log(`${attackingCard} attacks ${targetCard} for ${damage} damage!`);
    
    // Set up animation data
    setAttackAnimation({
      attackingCardIndex,
      targetCardIndex,
      damage,
      phase: 'moving' // 'moving' -> 'hitting' -> 'returning' -> 'complete'
    });
    
    // After 1 second, deal damage (when card "hits" target)
    setTimeout(() => {
      setDamageDealt(damage);
      setAttackAnimation(prev => prev ? { ...prev, phase: 'hitting' } : null);
      
      // Apply damage when the hit occurs using gameState values directly
      if (gameState?.damageDealt && gameState?.targetPlayer !== undefined && gameState?.targetCardIndex !== undefined) {
        if (gameState.targetPlayer === playerIndex) {
          // Damage to player's card
          setPlayerHP(prevHP => {
            const newHP = [...prevHP];
            newHP[gameState.targetCardIndex] = Math.max(0, newHP[gameState.targetCardIndex] - gameState.damageDealt);
            console.log(`Player ${playerIndex} card ${gameState.targetCardIndex} (${playerCards[gameState.targetCardIndex]}) took ${gameState.damageDealt} damage. HP: ${prevHP[gameState.targetCardIndex]} -> ${newHP[gameState.targetCardIndex]}`);
            return newHP;
          });
        } else {
          // Damage to opponent's card
          setOpponentHP(prevHP => {
            const newHP = [...prevHP];
            newHP[gameState.targetCardIndex] = Math.max(0, newHP[gameState.targetCardIndex] - gameState.damageDealt);
            console.log(`Opponent card ${gameState.targetCardIndex} (${opponentCards[gameState.targetCardIndex]}) took ${gameState.damageDealt} damage. HP: ${prevHP[gameState.targetCardIndex]} -> ${newHP[gameState.targetCardIndex]}`);
            return newHP;
          });
        }
      }
      
      // After showing damage briefly, start return animation
      setTimeout(() => {
        setAttackAnimation(prev => prev ? { ...prev, phase: 'returning' } : null);
        
        // After 1.5 seconds, complete animation and reset state
        setTimeout(() => {
          setAttackAnimation(null);
          setDamageDealt(null);
          setIsAttacking(false);
          
          // Notify server that animation is finished
          sendGameActionFinished();
        }, 1500);
      }, 500);
    }, 1000);
  }, [playerCards, opponentCards, gameState?.damageDealt, gameState?.targetPlayer, gameState?.targetCardIndex, playerIndex, sendGameActionFinished]);

  // Watch for server-confirmed attacks and trigger animation
  useEffect(() => {
    if (gameState?.isAttacking && !attackAnimation) {
      // Only trigger animation if we're not already animating
      const attackingCardIndex = gameState.attackingCardIndex;
      const targetCardIndex = gameState.targetCardIndex;
      
      if (attackingCardIndex !== undefined && targetCardIndex !== undefined) {
        startAttackAnimation(attackingCardIndex, targetCardIndex);
      }
    }
  }, [gameState?.isAttacking, gameState?.attackingCardIndex, gameState?.targetCardIndex]);

  const handleOpponentCardClick = (opponentIndex) => {
    // Check if it's the current player's turn and not already attacking
    console.log("isAttacking: ", isAttacking);
    console.log("gameState?.isAttacking: ", gameState?.isAttacking);
    if (currentPlayerIndex !== playerIndex || isAttacking || gameState?.isAttacking) {
      return;
    }
    
    if (currentCardIndex !== -1 && !showSpecialAbility) {
      console.log(`Attacking opponent card ${opponentIndex}: ${opponentCards[opponentIndex]} with ${playerCards[currentCardIndex]}`);
      
      // Set local attacking state to disable UI interactions
      setIsAttacking(true);
      
      // Send attack action to server (animation will trigger when server confirms)
      sendGameAction({
        type: 'attack',
        attackingCardIndex: currentCardIndex,
        targetCardIndex: opponentIndex,
        specialAbility: false
      });
    }
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
      <DisconnectionNotice
        onContinue={handleOpponentDisconnect}
        containerClassName={styles['game-layout']}
        backgroundStyle={{ background: backgroundGradient, transition: 'background 1s ease' }}
      />
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
            {opponentCards.slice(0, 3).map((card, index) => {
              // Determine if opponent is attacking with this card
              const isOpponentAttacking = gameState?.attackingPlayer !== playerIndex;
              
              // For animation, we need to determine source and target refs
              let sourceRef = null;
              let targetRef = null;
              let isAnimatingCard = false;
              
              if (isOpponentAttacking && attackAnimation?.attackingCardIndex === index) {
                // Opponent is attacking with this card - animate toward player's card
                sourceRef = opponentCardRefs.current[index];
                targetRef = playerCardRefs.current[attackAnimation.targetCardIndex];
                isAnimatingCard = true;
              }
              
              // Calculate animation positions
              let animateProps = {};
              if (isAnimatingCard && targetRef && sourceRef) {
                const targetRect = targetRef.getBoundingClientRect();
                const currentRect = sourceRef.getBoundingClientRect();
                const deltaX = targetRect.left - currentRect.left;
                const deltaY = targetRect.top - currentRect.top;
                
                if (attackAnimation.phase === 'moving') {
                  animateProps = {
                    x: deltaX,
                    y: deltaY,
                    scale: 1.1,
                    transition: { duration: 1, ease: 'easeInOut' }
                  };
                } else if (attackAnimation.phase === 'returning') {
                  animateProps = {
                    x: 0,
                    y: 0,
                    scale: 1,
                    transition: { duration: 1.5, ease: 'easeInOut' }
                  };
                }
              }
              
              return (
                <motion.div 
                  key={index} 
                  ref={el => opponentCardRefs.current[index] = el} 
                  animate={animateProps}
                  className={styles['motion-card-wrapper']} 
                  style={{ position: 'relative', zIndex: isAnimatingCard ? 1000 : 1 }}
                >
                  <MultiplayerCard 
                    card={card} 
                    isOpponent={true}
                    currentHP={opponentHP[index]}
                    maxHP={characterInfo.maxHP[card]}
                    isTargetable={currentCardIndex !== -1 && !showSpecialAbility && !isAttacking && currentPlayerIndex === playerIndex}
                    onClick={() => handleOpponentCardClick(index)}
                  />
                  {/* Damage display - show damage when this opponent card is the target */}
                  <AnimatePresence>
                    {damageDealt && attackAnimation?.targetCardIndex === index && gameState?.targetPlayer !== playerIndex && (
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.5 }}
                        animate={{ opacity: 1, y: -40, scale: 1.2 }}
                        exit={{ opacity: 0, y: -60, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        style={{
                          position: 'absolute',
                          top: '10%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          color: '#ff4444',
                          fontSize: '24px',
                          fontWeight: 'bold',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                          pointerEvents: 'none',
                          zIndex: 1000
                        }}
                      >
                        -{damageDealt}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
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
              cursor: currentCardIndex !== -1 && (!showSpecialAbility || characterInfo.isSpecialAbilityActive[playerCards[currentCardIndex]]) && !isAttacking && currentPlayerIndex === playerIndex ? 'pointer' : 'default',
              opacity: isAttacking ? 0.6 : 1
            }}
            onClick={() => {
              if (isAttacking || currentPlayerIndex !== playerIndex) return;
              
              if (currentCardIndex !== -1 && showSpecialAbility && characterInfo.isSpecialAbilityActive[playerCards[currentCardIndex]]) {
                handleSpecialAbility(playerCards[currentCardIndex]);
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
            {playerCards.slice(0, 3).map((card, index) => {
              // Determine if this card is involved in the current attack animation
              const isPlayerAttacking = gameState?.attackingPlayer === playerIndex;
              
              // For animation, we need to determine source and target refs
              let sourceRef = null;
              let targetRef = null;
              let isAnimatingCard = false;
              
              if (isPlayerAttacking && attackAnimation?.attackingCardIndex === index) {
                // Player is attacking with this card - animate toward opponent
                sourceRef = playerCardRefs.current[index];
                targetRef = opponentCardRefs.current[attackAnimation.targetCardIndex];
                isAnimatingCard = true;
              }
              
              // Calculate animation positions
              let animateProps = {};
              if (isAnimatingCard && targetRef && sourceRef) {
                const targetRect = targetRef.getBoundingClientRect();
                const currentRect = sourceRef.getBoundingClientRect();
                const deltaX = targetRect.left - currentRect.left;
                const deltaY = targetRect.top - currentRect.top;
                
                if (attackAnimation.phase === 'moving') {
                  animateProps = {
                    x: deltaX,
                    y: deltaY,
                    scale: 1.1,
                    transition: { duration: 1, ease: 'easeInOut' }
                  };
                } else if (attackAnimation.phase === 'returning') {
                  animateProps = {
                    x: 0,
                    y: 0,
                    scale: 1,
                    transition: { duration: 1.5, ease: 'easeInOut' }
                  };
                }
              }
              
              return (
                <motion.div 
                  key={index} 
                  ref={el => playerCardRefs.current[index] = el}
                  animate={animateProps}
                  className={styles['motion-card-wrapper']}
                  style={{ position: 'relative', zIndex: isAnimatingCard ? 1000 : 1 }}
                >
                  <MultiplayerCard 
                    card={card} 
                    isOpponent={false} 
                    isSelected={currentCardIndex === index}
                    currentHP={playerHP[index]}
                    maxHP={characterInfo.maxHP[card]}
                    onClick={() => {
                      if (isAttacking || currentPlayerIndex !== playerIndex) return;
                      
                      if (currentCardIndex === index) {
                        setCurrentCardIndex(-1);
                      } else {
                        setCurrentCardIndex(index);
                        setShowSpecialAbility(false);
                      }
                    }} 
                  />
                  {/* Damage display - show damage when this player card is the target */}
                  <AnimatePresence>
                    {damageDealt && attackAnimation?.targetCardIndex === index && gameState?.targetPlayer === playerIndex && (
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.5 }}
                        animate={{ opacity: 1, y: -40, scale: 1.2 }}
                        exit={{ opacity: 0, y: -60, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        style={{
                          position: 'absolute',
                          top: '10%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          color: '#ff4444',
                          fontSize: '24px',
                          fontWeight: 'bold',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                          pointerEvents: 'none',
                          zIndex: 1000
                        }}
                      >
                        -{damageDealt}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
