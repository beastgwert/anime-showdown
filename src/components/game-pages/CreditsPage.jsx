import { useState, useEffect} from 'react';
import Header from "../Header"
import { useOutletContext } from "react-router-dom";

export default function CreditsPage(){
    const [loadoutCards, setLoadoutCards, inventoryCards, setInventoryCards, setIsOverlay, setCurPage, setBgColor, cardLevels, setBgImage] = useOutletContext();

    useEffect(() => {
        setBgColor('#cdc17c');
        setBgImage('');
    })

    return (
        <>
            <Header setOverlay={() => setIsOverlay(true)}  curPage='credits'  changePage={(newPage) => setCurPage(newPage)}/>
            <div className="credits-page sub-page">
                <h1>Credits Page</h1>
            </div>
        </>
    )
}