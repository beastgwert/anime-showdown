import { useState, useEffect } from 'react';
import styles from '../../styles/MultiplayerOverlay.module.css';
import WaitingRoom from './WaitingRoom';
import MultiplayerOptions from './MultiplayerOptions';
import useSocket from '../../hooks/useSocket';

export default function MultiplayerOverlay({ onClose }) {
  const [step, setStep] = useState('options'); // options, waiting
  const [joinRoomCode, setJoinRoomCode] = useState('');
  
  // Initialize socket connection
  const {
    roomData,
    isHost,
    error,
    createRoom,
    joinRoom,
    startGame,
    leaveRoom,
    isConnected,
    isInRoom
  } = useSocket();

  // Handle room creation
  const handleCreateRoom = () => {
    if (!isConnected) {
      alert('Not connected to server. Please try again.');
      return;
    }
    createRoom();
  };

  // Handle room joining
  const handleJoinRoom = () => {
    if (joinRoomCode.length !== 6) {
      alert('Please enter a valid 6-character room code');
      return;
    }
    
    if (!isConnected) {
      alert('Not connected to server. Please try again.');
      return;
    }
    
    joinRoom(joinRoomCode.toUpperCase());
  };

  // Handle game start
  const handleStartGame = () => {
    startGame();
  };

  // Handle back button - leave room if in one
  const handleBack = () => {
    if (isInRoom) {
      leaveRoom();
    }
    setStep('options');
  };

  // Update step when room state changes
  useEffect(() => {
    if (roomData && step === 'options') {
      setStep('waiting');
    }
  }, [roomData, step]);

  // Show error messages
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  // Determine if opponent has joined (room has 2 players)
  const hasOpponentJoined = roomData?.players?.length === 2;
  
  // Get room code from room data
  const roomCode = roomData?.roomId || '';

  return (
    <div className={styles['multiplayer-overlay']}>
      <div className={styles['overlay-backdrop']}></div>
      <div className={styles['overlay-content']} onClick={(e) => e.stopPropagation()}>
        <button className={styles['close-button']} onClick={() => {
          if (isInRoom) {
            leaveRoom();
          }
          onClose();
        }}>
          <img src="/icons/close-button.svg" alt="Close" />
        </button>
        
        {step === 'options' && (
          <MultiplayerOptions
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            joinRoomCode={joinRoomCode}
            setJoinRoomCode={setJoinRoomCode}
            isConnected={isConnected}
          />
        )}
        
        {step === 'waiting' && (
          <WaitingRoom
            roomCode={roomCode}
            isHost={isHost}
            hasOpponentJoined={hasOpponentJoined}
            onStartGame={handleStartGame}
            onBack={handleBack}
            roomData={roomData}
          />
        )}
      </div>
    </div>
  );
}
