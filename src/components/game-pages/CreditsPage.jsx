import { useState, useEffect} from 'react';
import Header from "../Header"
import { useOutletContext } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';

export default function CreditsPage(){
    const [loadoutCards, setLoadoutCards, inventoryCards, setInventoryCards, setIsOverlay, setCurPage, setBgColor, cardLevels, setBgImage] = useOutletContext();

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
      })
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

    useEffect(() => {
        setBgColor('#cdc17c');
        setBgImage('');
    })


    return (
        <>
            <Header setOverlay={() => setIsOverlay(true)}  curPage='credits'  changePage={(newPage) => setCurPage(newPage)}/>
            <div className="credits-page sub-page">
                <h1>Credits Page</h1>
                <h1>Device Test!</h1>
                {isDesktopOrLaptop && <p>You are a desktop or laptop</p>}
                {isBigScreen && <p>You have a huge screen</p>}
                {isTabletOrMobile && <p>You are a tablet or mobile phone</p>}
                <p>Your are in {isPortrait ? 'portrait' : 'landscape'} orientation</p>
                {isRetina && <p>You are retina</p>}
            </div>
        </>
    )
}