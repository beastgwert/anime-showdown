import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import styles from '../styles/HomePage.module.css';
import { createApiUrl } from '../config/api';
import { useState, useEffect } from 'react';
import MultiplayerOverlay from './multiplayer/MultiplayerOverlay';
import CharacterInfoModal from './CharacterInfoModal';

export default function HomePage(){
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showMultiplayerOverlay, setShowMultiplayerOverlay] = useState(false);
    const [showCharacterInfo, setShowCharacterInfo] = useState(false);

    // Check authentication status on component mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch(createApiUrl('/api/auth/check'), {
                credentials: 'include'
            });
            const data = await response.json();
            setIsAuthenticated(data.authenticated);
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Get user info from Google using the access token
                const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`);
                const userInfo = await userInfoResponse.json();
                
                // Create a simple JWT-like token with user info (for compatibility with existing backend)
                const userToken = btoa(JSON.stringify({
                    email: userInfo.email,
                    given_name: userInfo.given_name,
                    name: userInfo.name,
                    picture: userInfo.picture,
                    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours from now
                }));

                // Send the user token to your backend to set httpOnly cookie
                const response = await fetch(createApiUrl('/api/auth/login'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ credential: userToken })
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                    navigate("/play/cards");
                } else {
                    console.error('Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        },
        onError: () => {
            console.log('Login Failed');
        }
    });

    if (isLoading) {
        return (
            <div className={`${styles['homepage-main']} page`}>
                <div className={styles['homepage-content']}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles['homepage-main']} page`}>
            <button 
                className={styles.infoIcon}
                onClick={() => setShowCharacterInfo(true)}
                aria-label="Character Information"
            >
                <img src="/icons/info.svg" alt="Info" />
            </button>
            
            <div className={styles['homepage-content']}>
                <p className={styles.transparent}>Anime Showdown</p>
                <div className={styles['homepage-caption']}><p className={styles['typed-out']}>A turn-based character card game!</p></div>
                <div className={styles['button-container']}>
                    <button className={styles['play-button']} onClick={() => isAuthenticated ? navigate("/play/cards") : login()}>
                        Story Mode
                    </button>
                    <button className={styles['multiplayer-button']} onClick={() => setShowMultiplayerOverlay(true)}>
                        Multiplayer
                    </button>
                </div>
                
                {showMultiplayerOverlay && (
                    <MultiplayerOverlay onClose={() => setShowMultiplayerOverlay(false)} />
                )}
                
                <CharacterInfoModal 
                    isOpen={showCharacterInfo} 
                    onClose={() => setShowCharacterInfo(false)} 
                />
            </div>
            <div className={styles['page-footer']}>
                <p><a target="_blank" rel="noopener noreferrer" href="https://tinyurl.com/mru4bk9d">Lofi Anime Wallpaper</a> 2023</p>
                <p>Pikswell, CC BY-NC-ND 3.0 </p>
            </div>
        </div>
    );
}