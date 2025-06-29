import { useState } from 'react';
import styles from '../../styles/MultiplayerOverlay.module.css';
import WaitingRoom from './WaitingRoom';
import MultiplayerOptions from './MultiplayerOptions';

export default function MultiplayerOverlay({ onClose }) {
  const [step, setStep] = useState('options'); // options, waiting
  const [roomCode, setRoomCode] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [hasOpponentJoined, setHasOpponentJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);

  // Mock functions - will be replaced with actual socket.io implementation
  const handleCreateRoom = () => {
    // Generate a random 6-character room code
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(generatedCode);
    setHasOpponentJoined(false);
    setIsHost(true);
    setStep('waiting');
  };

  const handleJoinRoom = () => {
    if (joinRoomCode.length !== 6) {
      alert('Please enter a valid 6-character room code');
      return;
    }
    
    // Mock joining a room
    // setRoomCode(joinRoomCode);
    // setHasOpponentJoined(true);
    // setIsHost(false);
    // setStep('waiting');
  };

  const handleStartGame = () => {
    alert('Game starting! (To be implemented)');
    onClose();
  };

  return (
    <div className={styles['multiplayer-overlay']}>
      <div className={styles['overlay-backdrop']}></div>
      <div className={styles['overlay-content']} onClick={(e) => e.stopPropagation()}>
        <button className={styles['close-button']} onClick={onClose}>
          <img src="/icons/close-button.svg" alt="Close" />
        </button>
        
        {step === 'options' && (
          <MultiplayerOptions
            joinRoomCode={joinRoomCode}
            setJoinRoomCode={setJoinRoomCode}
            handleCreateRoom={handleCreateRoom}
            handleJoinRoom={handleJoinRoom}
          />
        )}

        {step === 'waiting' && (
          <WaitingRoom
            roomCode={roomCode}
            isHost={isHost}
            hasOpponentJoined={hasOpponentJoined}
            onStartGame={handleStartGame}
            onBack={() => setStep('options')}
          />
        )}
      </div>
    </div>
  );
}
