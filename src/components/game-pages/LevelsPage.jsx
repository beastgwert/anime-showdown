import { useState, useEffect} from 'react';
import LevelsDisplay from '../LevelsDisplay';
import Level from '../Level';
import { useParams } from 'react-router-dom';
import '../../styles/LevelsPage.css'
import Header from '../Header';
import { useOutletContext } from 'react-router-dom';

export default function LevelsPage(){
    const [loadoutCards, setLoadoutCards, inventoryCards, setInventoryCards, setIsOverlay, setCurPage, setBgColor, cardLevels, setBgImage, stagesComplete, setStagesComplete, levelPoints, setLevelPoints] = useOutletContext();
    const {level = -1} = useParams();
    console.log("got to levels page: ", level);
    useEffect(() => {
        console.log("got to levels useeffect");
        if(level == -1){
            setBgImage(`url('/images/clouds-background.png')`);
            setBgColor('#cdc17c');
        }
    })
    
    return (
        <>
            <Header setOverlay={() => setIsOverlay(true)}  curPage='levels'  changePage={(newPage) => setCurPage(newPage)}/>
            <div className="levels-page sub-page">
                {level == -1 ? 
                    <LevelsDisplay stagesComplete={stagesComplete}/>
                :
                    <Level 
                    levelNumber = {level}
                    loadoutCards = {loadoutCards}
                    setBgColor = {setBgColor}
                    setBgImage = {setBgImage}
                    cardLevels = {cardLevels}
                    enemyName = {'Kirito'}
                    enemyLevel = {3}
                    stagesComplete = {stagesComplete}
                    setStagesComplete = {setStagesComplete}
                    levelPoints = {levelPoints}
                    setLevelPoints = {setLevelPoints}
                    />
                }
                
            </div>
        </>
    )
}