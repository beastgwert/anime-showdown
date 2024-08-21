import React from 'react';
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PrimeReactProvider } from 'primereact/api';
import HomePage from './components/HomePage.jsx';
import GamePage from './components/game-pages/GamePage.jsx';
import './styles/main.css'
import CardsPage from './components/game-pages/CardsPage.jsx';
import LevelsPage from './components/game-pages/LevelsPage.jsx';
import CreditsPage from './components/game-pages/CreditsPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: '/play',
    element: <GamePage/>,
    children: [
      {path: 'cards', element: <CardsPage/>},
      {path: 'levels', element: <LevelsPage/>},
      {path: 'credits', element: <CreditsPage/>},
      {path: 'levels/:level', element: <LevelsPage/>},
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId="781072947465-1dd6ojurcqvm0aqqk9u6hc4uirpmilb1.apps.googleusercontent.com">
      <PrimeReactProvider value = {{ripple: true}}>
        <RouterProvider router = {router} />
      </PrimeReactProvider>
    </GoogleOAuthProvider>
)
