import { useState, useEffect} from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../Header';
import '../../styles/CardPage.css'
import '../../styles/Card.css'
import Card from '../card'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function CardsPage(){
    const [loadoutCards, setLoadoutCards, inventoryCards, setInventoryCards, setIsOverlay, setCurPage, setBgColor, cardLevels, setBgImage] = useOutletContext();
    const [isSwapping, setIsSwapping] = useState("");

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
                <div className='cards-loadout'>
                    <h2>Loadout</h2>
                    <div className='cards-loadout-content'>
                        <Card name={loadoutCards[0]} isHighlighted={isSwapping == loadoutCards[0]} handleSwapping={handleSwapping} cardLevels={cardLevels}/>
                        <Card name={loadoutCards[1]} isHighlighted={isSwapping == loadoutCards[1]} handleSwapping={handleSwapping} cardLevels={cardLevels}/>
                        <Card name={loadoutCards[2]} isHighlighted={isSwapping == loadoutCards[2]} handleSwapping={handleSwapping} cardLevels={cardLevels}/>
                    </div>
                </div>
                <div className='cards-inventory'>
                    <div className='cards-inventory-content'>
                        <FaChevronLeft className='text-xl cursor-pointer hover:scale-75 ease-in-out duration-500' onClick={slideLeft}/>
                        <div id='slider' className='flex gap-6 w-2/3 h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide'>
                            <Card name={inventoryCards[0]} isHighlighted={isSwapping == inventoryCards[0]} handleSwapping={handleSwapping} cardLevels={cardLevels}/>
                            <Card name={inventoryCards[1]} isHighlighted={isSwapping == inventoryCards[1]} handleSwapping={handleSwapping} cardLevels={cardLevels}/>
                            <Card name={inventoryCards[2]} isHighlighted={isSwapping == inventoryCards[2]} handleSwapping={handleSwapping} cardLevels={cardLevels}/>
                            <Card name={inventoryCards[3]} isHighlighted={isSwapping == inventoryCards[3]} handleSwapping={handleSwapping} cardLevels={cardLevels}/>
                            <Card name={inventoryCards[4]} isHighlighted={isSwapping == inventoryCards[4]} handleSwapping={handleSwapping} cardLevels={cardLevels}/>
                            <Card name={inventoryCards[5]} isHighlighted={isSwapping == inventoryCards[5]} handleSwapping={handleSwapping} cardLevels={cardLevels}/>
                            <Card name={inventoryCards[6]} isHighlighted={isSwapping == inventoryCards[6]} handleSwapping={handleSwapping} cardLevels={cardLevels}/>
                        </div>
                        <FaChevronRight className='text-xl cursor-pointer hover:scale-75 ease-in-out duration-500' onClick={slideRight}/>
                    </div>
                </div>
            </div>
        </>
    )
}