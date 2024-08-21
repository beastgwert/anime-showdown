import { useState, useEffect} from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../Header';
import '../../styles/CardPage.css'
import '../../styles/Card.css'
import Card from '../Card'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function CardsPage(){
    const [loadoutCards, setLoadoutCards, inventoryCards, setInventoryCards, setIsOverlay, setCurPage, setBgColor,
        cardLevels, setBgImage, stagesComplete, setStagesComplete, levelPoints, setLevelPoints, handleLevelUp,
        handleSkillReset] = useOutletContext();
    const [isSwapping, setIsSwapping] = useState("");
    const loadoutIndices = [...Array(3).keys()];
    const inventoryIndices = [...Array(7).keys()];

    useEffect(() => {
        setBgColor('#cdc17c');
        setBgImage('');
    })
    
    function handleSwapping(e){
        const beingSwapped = e.target.closest('.card').id;
        
        if(isSwapping == ""){
            setIsSwapping(beingSwapped);
        }
        else{
            if(beingSwapped == isSwapping) return;

            const tempLoadout = JSON.parse(JSON.stringify(loadoutCards));
            const tempInventory = JSON.parse(JSON.stringify(inventoryCards));
            let index1 = -1;
            let index2 = -1;
            
            if(tempLoadout.includes(isSwapping) && tempLoadout.includes(beingSwapped)){
                index1 = tempLoadout.indexOf(isSwapping);
                index2 = tempLoadout.indexOf(beingSwapped);
                [tempLoadout[index1], tempLoadout[index2]] = [tempLoadout[index2], tempLoadout[index1]]
            }
            else if(tempInventory.includes(isSwapping) && tempInventory.includes(beingSwapped)){
                index1 = tempInventory.indexOf(isSwapping);
                index2 = tempInventory.indexOf(beingSwapped);
                [tempInventory[index1], tempInventory[index2]] = [tempInventory[index2], tempInventory[index1]]
            }
            else if(tempLoadout.includes(isSwapping) && tempInventory.includes(beingSwapped)){
                index1 = tempLoadout.indexOf(isSwapping);
                index2 = tempInventory.indexOf(beingSwapped);
                [tempLoadout[index1], tempInventory[index2]] = [tempInventory[index2], tempLoadout[index1]]
            }
            else{
                index1 = tempInventory.indexOf(isSwapping);
                index2 = tempLoadout.indexOf(beingSwapped);
                [tempInventory[index1], tempLoadout[index2]] = [tempLoadout[index2], tempInventory[index1]]
            }
            setLoadoutCards(tempLoadout);
            setInventoryCards(tempInventory);
            setIsSwapping("");
        }
    }

    function slideLeft(){
        const slider = document.getElementById('slider');
        slider.scrollLeft = slider.scrollLeft - 200;
    }

    function slideRight(){
        const slider = document.getElementById('slider');
        slider.scrollLeft = slider.scrollLeft + 200;
    }
    return (
        <>
            <Header setOverlay={() => setIsOverlay(true)}  curPage='cards'  changePage={(newPage) => setCurPage(newPage)}/>
            <div className="cards-page sub-page">
                <div className='level-points-wrapper'>
                    <p className='level-points-title'>Skill Points: {levelPoints}</p>
                    <i className='level-points-reset fa-solid fa-arrow-rotate-right' onClick={handleSkillReset}></i>
                </div>
                <div className='cards-loadout'>
                    <h2>Loadout</h2>
                    <div className='cards-loadout-content'>
                        {
                            loadoutIndices.map((i) => {
                                return <Card key={i} name={loadoutCards[i]} isHighlighted={isSwapping == loadoutCards[i]} handleSwapping={handleSwapping}
                                 cardLevels={cardLevels} levelPoints={levelPoints} handleLevelUp={handleLevelUp}/>
                            })
                        }
                    </div>
                </div>
                <div className='cards-inventory'>
                    <div className='cards-inventory-content'>
                        <FaChevronLeft className='text-xl cursor-pointer hover:scale-75 ease-in-out duration-500' onClick={slideLeft}/>
                        <div id='slider' className='flex gap-6 w-2/3 h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide'>
                            {
                                inventoryIndices.map((i) => {
                                    return <Card key={i} name={inventoryCards[i]} isHighlighted={isSwapping == inventoryCards[i]} handleSwapping={handleSwapping}
                                     cardLevels={cardLevels} levelPoints={levelPoints} handleLevelUp={handleLevelUp}/>
                                })
                            }
                        </div>
                        <FaChevronRight className='text-xl cursor-pointer hover:scale-75 ease-in-out duration-500' onClick={slideRight}/>
                    </div>
                </div>
            </div>
        </>
    )
}