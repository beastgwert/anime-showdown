import { useState, useEffect, useRef} from 'react';
import { jwtDecode } from 'jwt-decode';
import ErrorPage from './ErrorPage';
import LoadingPage from './LoadingPage';
import Header from '../Header';
import Cookies from 'universal-cookie';
import '../../styles/GamePage.css'
import IntroOverlay from '../Overlays/IntroOverlay';
import { Outlet } from 'react-router-dom';
import characterInfo from '../../character-info';

export default function GamePage(){
    const [firstUpdate, setFirstUpdate] = useState(true);
    const cookies = new Cookies(null, {path: '/'});
    cookies.remove('jwt_authorization', {path: '/play'}); // fix cookie refresh erroneously generating jwt_authorization at /play

    const [jwtToken, setjwtToken] = useState(!cookies.get('jwt_authorization') ? "no_token" : cookies.get('jwt_authorization'));
    const [userInfo, setUserInfo] = useState(jwtToken == "no_token" ? null : jwtDecode(jwtToken));
    const [playerInfo, setPlayerInfo] = useState({email: "", username: ""});
    const [isOverlay, setIsOverlay] = useState(false);
    const [curPage, setCurPage] = useState("cards");
    const [loadoutCards, setLoadoutCards] = useState(characterInfo.defaultValues.loadout);
    const [inventoryCards, setInventoryCards] = useState(characterInfo.defaultValues.inventory);
    const [cardLevels, setCardLevels] = useState(characterInfo.defaultValues.cardLevels);
    const [stagesComplete, setStagesComplete] = useState(characterInfo.defaultValues.stagesComplete);
    const [levelPoints, setLevelPoints] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [bgColor, setBgColor] = useState('#cdc17c')
    const [bgImage, setBgImage] = useState('');

    // console.log("test", jwtToken, userInfo);
    console.log("Loadout cards: ", loadoutCards);
    console.log("Inventory cards: ", inventoryCards);

    console.log("main player info: ", playerInfo);
    console.log("colors: ", bgColor, bgImage);
    console.log("first update: ", firstUpdate);
    console.log("level points: ", levelPoints);
    // search for email and add one if not found
    async function handleFetchData(){
        console.log("here");
        if(jwtToken == "no_token" || !firstUpdate) return;

        // check if user exists
        var tempUserExists = false;
        await fetch("https://anime-showdown.up.railway.app/api/userExists?" + new URLSearchParams({email: userInfo.email}).toString(), { mode: "cors"})
            .then((res) => res.json())
            .then((data) => {tempUserExists = data;})
            .catch((error) => console.log(error));
        
        // add new player if not in database
        if(!tempUserExists){
            console.log("passed info: ", loadoutCards, inventoryCards)
            await fetch("https://anime-showdown.up.railway.app/api", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
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
        await fetch("https://anime-showdown.up.railway.app/api?" + new URLSearchParams({email: userInfo.email}).toString(), { mode: "cors"})
        .then((res) => res.json())
        .then((data) => {
            setPlayerInfo(data.playerInfo);
            setLoadoutCards(data.cardInfo.loadout);
            setInventoryCards(data.cardInfo.inventory);
            setStagesComplete(data.stagesInfo);
            setLevelPoints(data.levelPoints);
            console.log("Data: ", data);
        })
        .catch((error) => console.log(error));

        console.log("Got to end of handle fetch: ", tempUserExists);
    }

    async function handleCardsUpdate(){
        if(firstUpdate) return;
        
        console.log("got to handle cards", loadoutCards, inventoryCards);
        await fetch("https://anime-showdown.up.railway.app/api/update/cards", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: userInfo.email,
                loadoutCards: loadoutCards,
                inventoryCards: inventoryCards,
                cardLevels: cardLevels,
            }),
        }).then((res) => res.json()).catch((error) => console.log(error));
    }

    async function handleStagesUpdate(){
        if(firstUpdate) return;

        console.log("got to handle stages", stagesComplete);
        await fetch("https://anime-showdown.up.railway.app/api/update/stages", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: userInfo.email,
                stagesComplete: stagesComplete
            }),
        }).then((res) => res.json()).catch((error) => console.log(error));
    }

    async function handleLevelPointsUpdate(){
        if(firstUpdate) return;

        console.log("got to level points:", levelPoints);
        await fetch("https://anime-showdown.up.railway.app/api/update/levelPoints", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: userInfo.email,
                levelPoints: levelPoints
            }),
        }).then((res) => res.json()).catch((error) => console.log(error));
    }
    useEffect(() => { 
        handleFetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        handleCardsUpdate();
    }, [loadoutCards, inventoryCards]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        handleStagesUpdate();
    }, [stagesComplete]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        handleLevelPointsUpdate();
    }, [levelPoints]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        setTimeout( () => {
            setFirstUpdate(false);
            setIsLoading(false);
        }, 1000);
    }, [isLoading]);

    if(jwtToken == "no_token") return (<ErrorPage />);


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
            <div className="gamepage-main page" style={{ 'background': bgImage == '' ? bgColor : bgImage}}
            onClick={() => setLevelPoints(0)}>
                <Outlet context={[loadoutCards, setLoadoutCards, inventoryCards, setInventoryCards, setIsOverlay,
                    setCurPage, setBgColor, cardLevels, setBgImage, stagesComplete, setStagesComplete]}/>
            </div>
            </>
        }
        </>
    )
}