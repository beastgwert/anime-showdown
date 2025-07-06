import { useState, useEffect } from 'react';
import styles from '../../styles/MultiplayerGame.module.css';
import MultiplayerCard from './MultiplayerCard';
import characterInfo from '../../character-info.jsx';

export default function MultiplayerGame({ gameState, playerIndex, onGameEnd }) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(1);
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
    const myColor = characterInfo.bgColors[playerCards[currentCardIndex]] || '#0f3460';
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
          <div className={styles['battle-zone']}>
            <div className={styles['vs-text']}>VS</div>
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
                onClick={() => setCurrentCardIndex(index)} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
