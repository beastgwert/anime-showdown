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

export default function MultiplayerGame({ gameState, playerIndex, sendGameAction, sendGameActionFinished, sendGameEnd, onGameEnd, handleOpponentDisconnect}) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(-1);
  const [playerCards, setPlayerCards] = useState(gameState.players[playerIndex].deck || []);
  const [opponentCards, setOpponentCards] = useState(gameState.players[playerIndex === 0 ? 1 : 0].deck || []);
  const [playerHP, setPlayerHP] = useState(() => {
    const initialDeck = gameState.players[playerIndex].deck || [];
    return initialDeck.map(cardName => characterInfo.maxHP?.[cardName] || 1000);
  });
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

  // Handle Makima's passive ability
  const getDistributedDamageForCard = (cardIndex, isPlayerCard, totalDamage) => {
    const hpArray = isPlayerCard ? playerHP : opponentHP;
    const cards = isPlayerCard ? playerCards : opponentCards;
    
    if (!cards.includes('Makima')) {
      return attackAnimation?.targetCardIndex === cardIndex ? totalDamage : 0;
    }
    
    const aliveCount = hpArray.filter(hp => hp > 0).length;
    if (aliveCount === 0 || hpArray[cardIndex] <= 0) {
      return 0;
    }
    
    return Math.floor(totalDamage / aliveCount);
  };

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

  // Check if all player cards are dead and end the game
  useEffect(() => {
    if (gameState?.gamePhase === 'active' && playerHP.length > 0) {
      if (playerHP.every(hp => hp <= 0)) {
        sendGameEnd();
      }
    }
  }, [playerHP, gameState?.gamePhase, sendGameEnd]);

  const handleSpecialAbility = (cardName) => {
    console.log(`${cardName}'s special ability was used`);
  }

  const startAttackAnimation = useCallback((attackingCardIndex, targetCardIndex) => {
    const attackingCard = playerCards[attackingCardIndex];
    const targetCard = opponentCards[targetCardIndex];
    
    const damage = gameState?.damageDealt || 0;
    console.log(`${attackingCard} attacks ${targetCard} for ${damage} damage!`);
    
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
      
      if (gameState?.damageDealt && gameState?.targetPlayer !== undefined && gameState?.targetCardIndex !== undefined) {
        if (gameState.targetPlayer === playerIndex) {
          setPlayerHP(prevHP => {
            const newHP = [...prevHP];
            
            if (playerCards.includes('Makima')) {
              const aliveCardIndices = [];
              for (let i = 0; i < prevHP.length; i++) {
                if (prevHP[i] > 0) {
                  aliveCardIndices.push(i);
                }
              }
              
              if (aliveCardIndices.length > 0) {
                const distributedDamage = Math.floor(gameState.damageDealt / aliveCardIndices.length);
                const remainderDamage = gameState.damageDealt % aliveCardIndices.length;
                
                aliveCardIndices.forEach((cardIndex, i) => {
                  const damageToApply = distributedDamage + (i < remainderDamage ? 1 : 0);
                  newHP[cardIndex] = Math.max(0, newHP[cardIndex] - damageToApply);
                });
              }
            } else {
              newHP[gameState.targetCardIndex] = Math.max(0, newHP[gameState.targetCardIndex] - gameState.damageDealt);
            }
            
            return newHP;
          });
        } else {
          setOpponentHP(prevHP => {
            const newHP = [...prevHP];
            
            if (opponentCards.includes('Makima')) {
              const aliveCardIndices = [];
              for (let i = 0; i < prevHP.length; i++) {
                if (prevHP[i] > 0) {
                  aliveCardIndices.push(i);
                }
              }
              
              if (aliveCardIndices.length > 0) {
                const distributedDamage = Math.floor(gameState.damageDealt / aliveCardIndices.length);
                const remainderDamage = gameState.damageDealt % aliveCardIndices.length;
                
                aliveCardIndices.forEach((cardIndex, i) => {
                  const damageToApply = distributedDamage + (i < remainderDamage ? 1 : 0);
                  newHP[cardIndex] = Math.max(0, newHP[cardIndex] - damageToApply);
                });
              }
            } else {
              newHP[gameState.targetCardIndex] = Math.max(0, newHP[gameState.targetCardIndex] - gameState.damageDealt);
            }
            
            return newHP;
          });
        }
      }
      
      // Return animation
      setTimeout(() => {
        setAttackAnimation(prev => prev ? { ...prev, phase: 'returning' } : null);
        setTimeout(() => {
          setAttackAnimation(null);
          setDamageDealt(null);
          setIsAttacking(false);
          setCurrentCardIndex(-1);
          sendGameActionFinished();
        }, 1500);
      }, 500);
    }, 1000);
  }, [playerCards, opponentCards, gameState?.damageDealt, gameState?.targetPlayer, gameState?.targetCardIndex, playerIndex, sendGameActionFinished]);

  // Watch for server-confirmed attacks and trigger animation
  useEffect(() => {
    if (gameState?.isAttacking && !attackAnimation) {
      const attackingCardIndex = gameState.attackingCardIndex;
      const targetCardIndex = gameState.targetCardIndex;
      
      if (attackingCardIndex !== undefined && targetCardIndex !== undefined) {
        startAttackAnimation(attackingCardIndex, targetCardIndex);
      }
    }
  }, [gameState?.isAttacking, gameState?.attackingCardIndex, gameState?.targetCardIndex]);

  const handleOpponentCardClick = (opponentIndex) => {
    // console.log("isAttacking: ", isAttacking);
    // console.log("gameState?.isAttacking: ", gameState?.isAttacking);
    if (currentPlayerIndex !== playerIndex || isAttacking || gameState?.isAttacking) {
      return;
    }
    
    if (opponentHP[opponentIndex] <= 0) {
      return;
    }
    
    if (currentCardIndex !== -1 && !showSpecialAbility) {
      console.log(`Attacking opponent card ${opponentIndex}: ${opponentCards[opponentIndex]} with ${playerCards[currentCardIndex]}`);
      setIsAttacking(true);
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
    const isWinner = gameState.winner && gameState.winner === gameState.players[playerIndex]?.socketId;
    const isLoser = gameState.loser && gameState.loser === gameState.players[playerIndex]?.socketId;
    
    return (
      <div className={styles['game-layout']} style={{ background: backgroundGradient, transition: 'background 1s ease' }}>
        <div className={styles['game-end-overlay']}>
          <div className={styles['game-end-content']}>
            {isWinner && (
              <>
                <h1 className={styles['victory-text']}>VICTORY!</h1>
                <p className={styles['game-end-message']}>You're the GOAT</p>
              </>
            )}
            {isLoser && (
              <>
                <h1 className={styles['defeat-text']}>DEFEAT :(</h1>
                <p className={styles['game-end-message']}>Better luck next time...</p>
              </>
            )}
            {!isWinner && !isLoser && (
              <>
                <h1 className={styles['game-end-text']}>Game Ended</h1>
                <p className={styles['game-end-message']}>The game has concluded.</p>
              </>
            )}
            <p className={styles['return-message']}>Returning to lobby...</p>
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
                    isDead={opponentHP[index] <= 0}
                    isTargetable={currentCardIndex !== -1 && !showSpecialAbility && !isAttacking && currentPlayerIndex === playerIndex && opponentHP[index] > 0}
                    hasAnyaProtection={attackAnimation && gameState?.targetPlayer !== playerIndex && attackAnimation.targetCardIndex === index && opponentCards.includes('Anya') && !gameState?.attackDodged}
                    hasMakimaDistribution={attackAnimation && gameState?.targetPlayer !== playerIndex && opponentCards.includes('Makima') && opponentHP[index] > 0 && !gameState?.attackDodged}
                    onClick={() => handleOpponentCardClick(index)}
                  />
                  {/* Damage/Dodge display - show when this opponent card is affected by attack */}
                  <AnimatePresence>
                    {(() => {
                      const cardDamage = getDistributedDamageForCard(index, false, damageDealt || 0);
                      const shouldShowDamage = ((damageDealt && damageDealt > 0) || gameState?.attackDodged) && 
                        (attackAnimation?.targetCardIndex === index || (opponentCards.includes('Makima') && cardDamage > 0)) && 
                        gameState?.targetPlayer !== playerIndex;
                      
                      return shouldShowDamage && (
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
                            color: gameState?.attackDodged ? '#00ff88' : '#ff4444',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            pointerEvents: 'none',
                            zIndex: 1000
                          }}
                        >
                          {gameState?.attackDodged ? 'DODGED!' : `-${cardDamage}`}
                        </motion.div>
                      );
                    })()}
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
              cursor: currentCardIndex !== -1 && (!showSpecialAbility || characterInfo.isSpecialAbilityActive[playerCards[currentCardIndex]]) && !isAttacking && currentPlayerIndex === playerIndex ? 'pointer' : 'default'
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
              const isPlayerAttacking = gameState?.attackingPlayer === playerIndex;
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
                    isDead={playerHP[index] <= 0}
                    hasAnyaProtection={attackAnimation && gameState?.targetPlayer === playerIndex && attackAnimation.targetCardIndex === index && playerCards.includes('Anya') && !gameState?.attackDodged}
                    hasMakimaDistribution={attackAnimation && gameState?.targetPlayer === playerIndex && playerCards.includes('Makima') && playerHP[index] > 0 && !gameState?.attackDodged}
                    onClick={() => {
                      if (isAttacking || currentPlayerIndex !== playerIndex || playerHP[index] <= 0) return;
                      
                      if (currentCardIndex === index) {
                        setCurrentCardIndex(-1);
                      } else {
                        setCurrentCardIndex(index);
                        setShowSpecialAbility(false);
                      }
                    }} 
                  />
                  {/* Damage/Dodge display - show when this player card is affected by attack */}
                  <AnimatePresence>
                    {(() => {
                      const cardDamage = getDistributedDamageForCard(index, true, damageDealt || 0);
                      const shouldShowDamage = ((damageDealt && damageDealt > 0) || gameState?.attackDodged) && 
                        (attackAnimation?.targetCardIndex === index || (playerCards.includes('Makima') && cardDamage > 0)) && 
                        gameState?.targetPlayer === playerIndex;
                      
                      return shouldShowDamage && (
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
                            color: gameState?.attackDodged ? '#00ff88' : '#ff4444',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            pointerEvents: 'none',
                            zIndex: 1000
                          }}
                        >
                          {gameState?.attackDodged ? 'DODGED!' : `-${cardDamage}`}
                        </motion.div>
                      );
                    })()}
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
