import { useState, useEffect, useRef} from 'react';
import LoadingPage from './LoadingPage';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { createApiUrl } from '../../config/api';
import '../../styles/GamePage.css'
import IntroOverlay from '../Overlays/IntroOverlay';
import { Outlet } from 'react-router-dom';
import characterInfo from '../../character-info';

export default function GamePage(){
    const navigate = useNavigate();
    const [firstUpdate, setFirstUpdate] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [jwtToken, setJwtToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [playerInfo, setPlayerInfo] = useState({email: "", username: ""});
    const [isOverlay, setIsOverlay] = useState(false);
    const [curPage, setCurPage] = useState("cards");
    const [loadoutCards, setLoadoutCards] = useState(characterInfo.defaultValues.loadout);
    const [inventoryCards, setInventoryCards] = useState(characterInfo.defaultValues.inventory);
    const [cardLevels, setCardLevels] = useState(characterInfo.defaultValues.cardLevels);
    const [stagesComplete, setStagesComplete] = useState(characterInfo.defaultValues.stagesComplete);
    const [levelPoints, setLevelPoints] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [bgColor, setBgColor] = useState('#cdc17c')
    const [bgImage, setBgImage] = useState('');

    // API URL is now centralized in config/api.js
    
    console.log("Loadout cards: ", loadoutCards);
    console.log("Inventory cards: ", inventoryCards);
    console.log("main player info: ", playerInfo);
    console.log("colors: ", bgColor, bgImage);
    console.log("first update: ", firstUpdate);
    console.log("level points: ", levelPoints);

    // Check authentication status on component mount
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch(createApiUrl('/api/auth/check'), {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (data.authenticated && data.token) {
                    setIsAuthenticated(true);
                    setJwtToken(data.token);
                    
                    // Decode the base64-encoded JSON token
                    try {
                        const decodedUserInfo = JSON.parse(atob(data.token));
                        setUserInfo(decodedUserInfo);
                    } catch (decodeError) {
                        console.error('Token decode error:', decodeError);
                        navigate('/');
                        return;
                    }
                } else {
                    // Redirect to home if not authenticated
                    navigate('/');
                    return;
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                navigate('/');
                return;
            }
        };
        
        checkAuthStatus();
    }, [navigate]);

    // Initialize existing player data with data from database
    useEffect(() => {
        const handleFetchData = async () => {
            console.log("here");
            if(!jwtToken || !userInfo || !firstUpdate) return;

            // check if user exists
            var tempUserExists = false;
            await fetch(createApiUrl("/api/userExists?") + new URLSearchParams({email: userInfo.email}).toString(), { 
                mode: "cors",
                credentials: 'include'
            })
                .then((res) => res.json())
                .then((data) => {tempUserExists = data;})
                .catch((error) => console.log(error));
            
            // add new player if not in database
            if(!tempUserExists){
                console.log("passed info: ", loadoutCards, inventoryCards)
                await fetch(createApiUrl("/api"), {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        email: userInfo.email,
                        username: userInfo.given_name,
                        loadoutCards: loadoutCards,
                        inventoryCards: inventoryCards,
                        cardLevels: cardLevels,
                        stagesComplete: stagesComplete,
                    }),
                }).then((res) => res.json()).catch((error) => console.log(error));

                console.log("got to end of tempUserExists: ", loadoutCards, inventoryCards);
                // show instructions if first-time player
                setIsOverlay(true);
            }
            console.log("got to update existing player: ");
            // update existing player
            await fetch(createApiUrl("/api?") + new URLSearchParams({email: userInfo.email}).toString(), { 
                mode: "cors",
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((data) => {
                setPlayerInfo(data.playerInfo);
                setLoadoutCards(data.cardInfo.loadout);
                setInventoryCards(data.cardInfo.inventory);
                setStagesComplete(data.stagesInfo);
                setLevelPoints(data.levelPoints);
                setCardLevels(data.cardLevels);
                console.log("Data: ", data);
            })
            .catch((error) => console.log(error));

            console.log("Got to end of handle fetch: ", tempUserExists);
            
            // Mark data as loaded after all state is set
            setIsDataLoaded(true);
        };
        
        if (isAuthenticated && userInfo) {
            handleFetchData();
        }
    }, [isAuthenticated, userInfo, jwtToken, firstUpdate]);
    
    // Update database on card changes
    useEffect(() => {
        const handleCardsUpdate = async () => {
            if(firstUpdate || !userInfo || !isDataLoaded) return;
            
            console.log("got to handle cards", loadoutCards, inventoryCards);
            await fetch(createApiUrl("/api/update/cards"), {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: userInfo.email,
                    loadoutCards: loadoutCards,
                    inventoryCards: inventoryCards,
                    cardLevels: cardLevels,
                }),
            }).then((res) => res.json()).catch((error) => console.log(error));
        };
        
        handleCardsUpdate();
    }, [firstUpdate, userInfo, loadoutCards, inventoryCards, cardLevels, isDataLoaded]);
    
    useEffect(() => {
        const handleStagesUpdate = async () => {
            if(firstUpdate || !userInfo || !isDataLoaded) return;

            console.log("got to handle stages", stagesComplete);
            await fetch(createApiUrl("/api/update/stages"), {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: userInfo.email,
                    stagesComplete: stagesComplete,
                }),
            }).then((res) => res.json()).catch((error) => console.log(error));
        };
        
        handleStagesUpdate();
    }, [firstUpdate, userInfo, stagesComplete, isDataLoaded]);
    
    useEffect(() => {
        const handleLevelPointsUpdate = async () => {
            if(firstUpdate || !userInfo || !isDataLoaded) return;

            console.log("got to handle level points", levelPoints);
            await fetch(createApiUrl("/api/update/levelPoints"), {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: userInfo.email,
                    levelPoints: levelPoints,
                }),
            }).then((res) => res.json()).catch((error) => console.log(error));
        };
        
        handleLevelPointsUpdate();
    }, [firstUpdate, userInfo, levelPoints, isDataLoaded]);
    useEffect(() => {
        if (isAuthenticated && userInfo) {
            setTimeout( () => {
                setFirstUpdate(false);
                setIsLoading(false);
            }, 1000);
        }
    }, [isAuthenticated, userInfo]);

    function handleLevelUp(name){
        let tempCardLevels = {...cardLevels};
        tempCardLevels[name] += 1;
        setCardLevels(tempCardLevels);
        setLevelPoints(levelPoints - 1);
    }

    function handleSkillReset(){
        let usedPoints = 0;
        loadoutCards.forEach((card) => {usedPoints += parseInt(cardLevels[card]) - 1;})
        inventoryCards.forEach((card) => {usedPoints += parseInt(cardLevels[card]) - 1;})
        setLevelPoints(parseInt(levelPoints) + parseInt(usedPoints));
        setCardLevels(characterInfo.defaultValues.cardLevels);
    }

    // Show loading while checking authentication
    if (!isAuthenticated || !userInfo) {
        return <LoadingPage />;
    }

    return (
        <>
        {
            isLoading ? 
            <LoadingPage/>
            :
            <>
            <IntroOverlay 
            isOpen={isOverlay}
            onClose={() => setIsOverlay(false)}
            username={playerInfo.username}
            />
             {/* onClick={() => {setStagesComplete([]); setCardLevels(characterInfo.defaultValues.cardLevels)}} */}
            <div className="gamepage-main page" style={{ 'background': bgImage == '' ? bgColor : bgImage}}
            // onClick={() => {setStagesComplete([1, 2, 3, 4, 5, 6, 7]); setLevelPoints(14);}}
            >
                <Outlet context={[loadoutCards, setLoadoutCards, inventoryCards, setInventoryCards, setIsOverlay,
                    setCurPage, setBgColor, cardLevels, setBgImage, stagesComplete, setStagesComplete, levelPoints, setLevelPoints, handleLevelUp,
                    handleSkillReset]}/>
            </div>
            </>
        }
        </>
    )
}