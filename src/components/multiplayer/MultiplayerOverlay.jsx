import { useState, useEffect } from 'react';
import styles from '../../styles/MultiplayerOverlay.module.css';
import WaitingRoom from './WaitingRoom';
import MultiplayerOptions from './MultiplayerOptions';
import MultiplayerGame from './MultiplayerGame';
import LoadoutSelection from './LoadoutSelection';
import useSocket from '../../hooks/useSocket';

export default function MultiplayerOverlay({ onClose }) {
  const [step, setStep] = useState('options'); // options, waiting, loadout, playing
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [playerLoadout, setPlayerLoadout] = useState(null);
  
  const {
    roomData,
    isHost,
    playerIndex,
    error,
    gameState,
    createRoom,
    joinRoom,
    startGame,
    confirmLoadout,
    leaveRoom,
    isConnected,
    isInRoom
  } = useSocket();

  const handleCreateRoom = () => {
    if (!isConnected) {
      alert('Not connected to server. Please try again.');
      return;
    }
    createRoom();
  };

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

  const handleStartGame = () => {
    // Instead of starting game directly, move to loadout selection
    setStep('loadout');
    startGame();
    console.log("Game started!!!!!")
  };
  
  const handleConfirmLoadout = (loadout) => {
    setPlayerLoadout(loadout);
    console.log('Player confirmed loadout:', loadout);
    // Send loadout confirmation to server
    confirmLoadout(loadout);
  };

  const handleBack = () => {
    // No back button allowed after game starts (loadout step)
    if (step === 'loadout') {
      return;
    }
    if (isInRoom) {
      leaveRoom();
    }
    setStep('options');
  };

  const handleOpponentDisconnect = () => {
    leaveRoom();
    setStep('options');
  };

  useEffect(() => {
    if (roomData && step === 'options') {
      setStep('waiting');
    }
  }, [roomData, step]);

  useEffect(() => {
    if (gameState && gameState.gamePhase === 'active' && step === 'loadout') {
      setStep('playing');
    } else if (gameState && gameState.gamePhase === 'loadout' && step === 'waiting') {
      setStep('loadout');
    }
  }, [gameState, step]);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const hasOpponentJoined = roomData?.players?.length === 2;
  const roomCode = roomData?.roomId || '';

  if (step === 'loadout') { // loadout screen
    return (
      <LoadoutSelection
        roomCode={roomCode}
        onConfirmLoadout={handleConfirmLoadout}
        gameState={gameState}
        handleOpponentDisconnect={handleOpponentDisconnect}
      />
    );
  }

  if (step === 'playing') { // gameplay
    return (
      <MultiplayerGame
        gameState={gameState}
        playerIndex={playerIndex}
        roomCode={roomCode}
        onGameEnd={() => {
          setStep('options');
        }}
        handleOpponentDisconnect={handleOpponentDisconnect}
      />
    );
  }
  
  return ( // game creation
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
