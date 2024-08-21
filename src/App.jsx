import { useState } from 'react';
import HomePage from './components/HomePage';
import GamePage from './components/game-pages/GamePage';
import './styles/App.css';

function App() {
  const [user, setUser] = useState([]);

  return (
    <>
      {
      user.length === 0 ? 
      <HomePage />
      :
      <GamePage />
      }
    </>
  )
}

export default App
