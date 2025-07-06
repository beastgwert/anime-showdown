import { useState, useEffect } from 'react';
import styles from '../../styles/MultiplayerGame.module.css';
import MultiplayerCard from './MultiplayerCard';

export default function MultiplayerGame({ gameState, playerIndex, roomCode, onGameEnd }) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [playerCards, setPlayerCards] = useState([]);
  const [opponentCards, setOpponentCards] = useState([]);

  useEffect(() => {
    if (gameState && gameState.players) {
      setCurrentPlayerIndex(gameState.currentPlayerIndex);
      
      const myPlayerData = gameState.players[playerIndex];
      const opponentPlayerData = gameState.players[playerIndex === 0 ? 1 : 0];
      
      setPlayerCards(myPlayerData?.deck || []);
      setOpponentCards(opponentPlayerData?.deck || []);
      
      console.log('Game state updated:', gameState);
      console.log('My player index:', playerIndex);
      console.log('Current player index:', gameState.currentPlayerIndex);
      console.log('My cards:', myPlayerData?.deck);
      console.log('Opponent cards:', opponentPlayerData?.deck);
    }
  }, [gameState, playerIndex]);

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
        <div className={styles['game-container']}>
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
        <div className={styles['game-container']}>
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
      <div className={styles['game-container']}>
        <div className={styles['game-header']}>
          <span className={styles['room-code']}>Room: {roomCode}</span>
          <span className={styles['turn-indicator']}>
            {currentPlayerIndex === playerIndex ? 'Your Turn' : 'Opponent\'s Turn'}
          </span>
        </div>

        <div className={styles['opponent-area']}>
          <div className={styles['opponent-label']}>Opponent</div>
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
          <div className={styles['player-label']}>Your Cards</div>
          <div className={styles['cards-container']}>
            {playerCards.slice(0, 3).map((card, index) => 
              <MultiplayerCard key={index} card={card} isOpponent={false} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
