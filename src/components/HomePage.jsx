import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import '../styles/HomePage.css';
import { createApiUrl } from '../config/api';
import { useState, useEffect } from 'react';

export default function HomePage(){
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
            <div className="homepage-main page">
                <div className='homepage-content'>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="homepage-main page">
            <div className='homepage-content'>
                <p>Anime Showdown</p>
                <div className='homepage-caption'><p className='typed-out'>A progression-based card game!</p></div>
                {
                isAuthenticated ? 
                <button className='play-button' onClick={() => navigate("/play/cards")}>
                    PLAY
                </button>
                :
                <button className='play-button' onClick={() => login()}>
                    Single Player
                </button>
                }
            </div>
            <div className='page-footer'>
                <p><a target="_blank" rel="noopener noreferrer" href="https://tinyurl.com/mru4bk9d">Lofi Anime Wallpaper</a> 2023</p>
                <p>Pikswell, CC BY-NC-ND 3.0 </p>
            </div>
        </div>
    );
}