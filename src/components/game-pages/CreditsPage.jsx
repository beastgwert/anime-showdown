import { useState, useEffect} from 'react';
import Header from "../Header"
import '../../styles/CreditsPage.css'
import { useOutletContext } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import CreditsCard from '../CreditsCard';

export default function CreditsPage(){
    const [loadoutCards, setLoadoutCards, inventoryCards, setInventoryCards, setIsOverlay, setCurPage, setBgColor, cardLevels, setBgImage] = useOutletContext();

    useEffect(() => {
        setBgColor('rgb(214 188 131)');
        setBgImage('');
    })


    return (
        <>
            <Header setOverlay={() => setIsOverlay(true)}  curPage='credits'  changePage={(newPage) => setCurPage(newPage)}/>
            <div className="credits-page sub-page">
                <div className='infinite-scroller'>
                    <div className='infinite-scroller-content'>
                        <CreditsCard name = 'Sung-jin-woo'/>
                        <CreditsCard name = 'Mikasa'/>
                        <CreditsCard name = 'Luffy'/>
                        <CreditsCard name = 'Gojo'/>
                        <CreditsCard name = 'Ichigo'/>
                        <CreditsCard name = 'Natsu'/>
                        <CreditsCard name = 'Kakashi'/>
                        <CreditsCard name = 'Anya'/>
                        <CreditsCard name = 'Mudkip'/>
                        <CreditsCard name = 'Genos'/>
                        <CreditsCard name = 'Makima'/>
                        <CreditsCard name = 'Kirito'/>
                        <CreditsCard name = 'Doflamingo'/>
                        <CreditsCard name = 'Tanjiro'/>
                        <CreditsCard name = 'Escanor'/>
                        <CreditsCard name = 'Anderson'/>
                        <CreditsCard name = 'Korosensei'/>
                        <CreditsCard name = 'Hisoka'/>
                        <CreditsCard name = 'Saitama'/>
                    </div>
                    <div className='infinite-scroller-content'>
                        <CreditsCard name = 'Sung-jin-woo'/>
                        <CreditsCard name = 'Mikasa'/>
                        <CreditsCard name = 'Luffy'/>
                        <CreditsCard name = 'Gojo'/>
                        <CreditsCard name = 'Ichigo'/>
                        <CreditsCard name = 'Natsu'/>
                        <CreditsCard name = 'Kakashi'/>
                        <CreditsCard name = 'Anya'/>
                        <CreditsCard name = 'Mudkip'/>
                        <CreditsCard name = 'Genos'/>
                        <CreditsCard name = 'Makima'/>
                        <CreditsCard name = 'Kirito'/>
                        <CreditsCard name = 'Doflamingo'/>
                        <CreditsCard name = 'Tanjiro'/>
                        <CreditsCard name = 'Escanor'/>
                        <CreditsCard name = 'Anderson'/>
                        <CreditsCard name = 'Korosensei'/>
                        <CreditsCard name = 'Hisoka'/>
                        <CreditsCard name = 'Saitama'/>
                    </div>
                </div>
            </div>
        </>
    )
}