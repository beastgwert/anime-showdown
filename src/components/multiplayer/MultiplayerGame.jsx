import { useState, useEffect } from 'react';
import styles from '../../styles/MultiplayerGame.module.css';
import MultiplayerCard from './MultiplayerCard';
import characterInfo from '../../character-info.jsx';

// Helper function to create a darker shade of a color
const getDarkerShade = (hexColor, factor = 0.3) => {
  // Default color if hexColor is invalid
  if (!hexColor || hexColor === 'black') return 'rgba(10, 10, 10, 0.9)';
  
  // Convert hex to RGB
  let r = parseInt(hexColor.substring(1, 3), 16);
  let g = parseInt(hexColor.substring(3, 5), 16);
  let b = parseInt(hexColor.substring(5, 7), 16);
  
  // Make it darker
  r = Math.max(0, Math.floor(r * (1 - factor)));
  g = Math.max(0, Math.floor(g * (1 - factor)));
  b = Math.max(0, Math.floor(b * (1 - factor)));
  
  // Return rgba with some transparency
  return `rgba(${r}, ${g}, ${b}, 0.9)`;
};

export default function MultiplayerGame({ gameState, playerIndex, onGameEnd, leaveRoom }) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(-1);
  const [playerCards, setPlayerCards] = useState(gameState.players[playerIndex].deck || []);
  const [opponentCards, setOpponentCards] = useState(gameState.players[playerIndex === 0 ? 1 : 0].deck || []);
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)');

  useEffect(() => {
    if (gameState && gameState.players) {
      setCurrentPlayerIndex(gameState.currentPlayerIndex);
      console.log('Game state updated:', gameState);
    }
  }, [gameState]);

  useEffect(() => {
    const myColor = characterInfo.bgColors[playerCards[currentCardIndex]] || '#091023';
    const opponentColor = characterInfo.bgColors[opponentCards[1]] || '#1a1a2e';
        
    // Create gradient: opponent color at top, player color at bottom
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
            className={styles['ability-display']}
            style={{ 
              background: currentCardIndex === -1 ? 'black' : getDarkerShade(characterInfo.bgColors[playerCards[currentCardIndex]]) 
            }}
          >
            {currentCardIndex === -1 ? (
              <div className={styles['vs-text']}>VS</div>
            ) : (
              <>
                <div className={styles['ability-title']}>{characterInfo.abilities[playerCards[currentCardIndex]][1]}</div>
                <div className={styles['ability-text']}>
                  {characterInfo.abilityDescription[playerCards[currentCardIndex]] || 'No ability description available'}
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
                onClick={() => setCurrentCardIndex(currentCardIndex === index ? -1 : index)} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
