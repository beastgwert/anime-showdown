import { useState, useEffect, useRef} from 'react';
import '../styles/Level.css'
import LevelCard from "./LevelCard";
import characterInfo from '../character-info';
import Ripple from './Ripple';
import VictoryOverlay from './Overlays/VictoryOverlay';
import LossOverlay from './Overlays/LossOverlay';

export default function Level({levelNumber, loadoutCards, setBgColor, setBgImage, cardLevels, enemyName, 
    enemyLevel, stagesComplete, setStagesComplete, levelPoints, setLevelPoints}){

    console.log('level rerendered!');
    const [isLevelBeat, setIsLevelBeat] = useState(false);
    const [isLevelLost, setIsLevelLost] = useState(false);
    const [xTransform, setXTransform] = useState([30, 5, 5]);
    const [yTransform, setYTransform] = useState([-10, -25, 5]);
    const [mainIndex, setMainIndex] = useState(0);
    const [firstUpdate, setFirstUpdate] = useState(true);
    const [isRotating, setIsRotating] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isSpecialAbility, setIsSpecialAbility] = useState(false);
    const [wasSpecialAbility, setWasSpecialAbility] = useState(false);
    const [isEnemyTurn, setIsEnemyTurn] = useState(false);
    const [enemyTarget, setEnemyTarget] = useState(-1);
    const [displayClicks, setDisplayClicks] = useState(0);
    const [loadoutHealth, setLoadoutHealth] = useState(loadoutCards.map((card) => characterInfo.health[card][cardLevels[card]-1]));
    const [enemyHealth, setEnemyHealth] = useState(characterInfo.health[enemyName][enemyLevel-1]);
    const [abilityDamages, setAbilityDamages] = useState(characterInfo.abilityDamages);
    const [isEnemyParalyzed, setIsEnemyParalyzed] = useState(false);
    const [isEnemyBurned, setIsEnemyBurned] = useState(false);
    const [isMikasaCharged, setIsMikasaCharged] = useState(false);
    const [luffyBuffCnt, setLuffyBuffCnt] = useState(0);
    const [gojoBuffCnt, setGojoBuffCnt] = useState(0);
    const [natsuBuffCnt, setNatsuBuffCnt] = useState(0);
    const numClicks = useRef(0);
    const mainCard = loadoutCards[mainIndex];
    console.log('Was special: ', wasSpecialAbility);
    
    useEffect(() => { // change background
        setBgColor(`linear-gradient(to right, ${characterInfo.bgColors[mainCard]}, ${characterInfo.bgColors[enemyName]})`)
        setBgImage(''); 
    });
    
    useEffect(() => { // adjust card damage based on level
        const tempAbilityDamages = {};
        Object.entries(abilityDamages).forEach(([name, dmgRange]) => {
            tempAbilityDamages[name] = [dmgRange[0] * cardLevels[name], dmgRange[1] * cardLevels[name]];
        });
        setAbilityDamages(tempAbilityDamages);
    }, [cardLevels]);
    useEffect(() => { // check if level is beat
        if(enemyHealth == 0) setIsLevelBeat(true);
    }, [enemyHealth])
    useEffect(() => { // check if level is lost
        if(loadoutHealth[0] == 0 && loadoutHealth[1] == 0 && loadoutHealth[2] == 0) setIsLevelLost(true);
    }, [loadoutHealth])
    useEffect(() => { // ally damage move
        if(!isClicking) return;
        setTimeout(() => {
            setTimeout(() => { // damage and status effect calculations
                let damage = Math.floor(getRandomInt(abilityDamages[mainCard][0], abilityDamages[mainCard][1]) 
                * (1 + numClicks.current * 0.02));

                let tempAbilityDamages = {...abilityDamages};
                if(mainCard == 'Mikasa' && isMikasaCharged){
                    if(getRandomInt(0, 10) < 2) setIsEnemyParalyzed(true);
                    setIsMikasaCharged(false);
                }
                if(mainCard == 'Luffy'){
                    if(luffyBuffCnt == 1){
                        tempAbilityDamages['Luffy'][0] /= 2; 
                        tempAbilityDamages['Luffy'][1] /= 2;
                        setAbilityDamages(tempAbilityDamages);
                    }
                    setLuffyBuffCnt(Math.max(0, luffyBuffCnt - 1));
                }
                if(mainCard == 'Natsu'){
                    setIsEnemyBurned(true);
                    if(natsuBuffCnt > 1 && getRandomInt(0, 20) < 1) setIsEnemyParalyzed(true); 
                    if(natsuBuffCnt == 1){
                        tempAbilityDamages['Natsu'][0] /= 1.5; 
                        tempAbilityDamages['Natsu'][1] /= 1.5;
                        setAbilityDamages(tempAbilityDamages);
                    }
                    setNatsuBuffCnt(Math.max(0, natsuBuffCnt - 1));
                }
                setEnemyHealth(Math.max(enemyHealth - damage, 0));
            }, 400)

            if(mainIndex == 2) setIsEnemyTurn(true);
            handleRotation(); 
            numClicks.current = 0;
            setDisplayClicks(0);
            setIsClicking(false);
            setWasSpecialAbility(false);
        }, 4000);
    }, [isClicking]);
    useEffect(() => { // boss move
        console.log('boss turn use effect reached', mainIndex);
        if(!isEnemyTurn || isClicking || firstUpdate || isRotating) return;

        if(isEnemyBurned){
            setTimeout(() => {
                setEnemyHealth(Math.max(0, enemyHealth - getRandomInt(40, 60)));
                setIsEnemyBurned(false);
            }, 500)
        }
        if(isEnemyParalyzed){
            setIsEnemyParalyzed(false);
            setIsEnemyTurn(false);
            return;
        }

        let validIndices = [];
        let curMin = 20000;
        let curMinIndex = 0;
        loadoutHealth.forEach((e, i) => {
            if(e > 0){
                validIndices.push(i);
                if(e <= curMin && e < characterInfo.health[loadoutCards[i]][cardLevels[loadoutCards[i]]-1]){
                    curMin = e;
                    curMinIndex = i;
                }
            }
        });
        let attackedIndex = curMin != 20000 && getRandomInt(0, 10) < 5 ? curMinIndex 
        : validIndices[getRandomInt(0, validIndices.length)];
        setEnemyTarget(attackedIndex);
        
        setTimeout(() => {
            let damage = getRandomInt(characterInfo.enemyAbilityDamages[enemyName][0], characterInfo.enemyAbilityDamages[enemyName][1]);
            if(loadoutCards[attackedIndex] == 'Gojo' && gojoBuffCnt > 0) 
                damage = 0;
            console.log("Boss damage: ", attackedIndex, gojoBuffCnt, damage, xTransform, yTransform);
            let tempHealth = [...loadoutHealth];
            tempHealth[attackedIndex] = Math.max(tempHealth[attackedIndex] - damage, 0);
            setLoadoutHealth(tempHealth);
        }, 2000)

        setTimeout(() => {
            setIsEnemyTurn(false);
            setEnemyTarget(-1);
            setGojoBuffCnt(gojoBuffCnt - 1);
        }, 3500);
    }, [isEnemyTurn, isRotating]);
    
    useEffect(() => { // special abilities
        console.log("got to initial special ability", isSpecialAbility, mainIndex);
        if(!isSpecialAbility) return;
        if(mainIndex == 2) setIsEnemyTurn(true);

        let tempAbilityDamages = {...abilityDamages};
        if(loadoutCards[mainIndex] == 'Sung-jin-woo'){
            let healAmount = Math.floor(characterInfo.health['Sung-jin-woo'][cardLevels['Sung-jin-woo']-1] / 5); 
            setLoadoutHealth(loadoutHealth.map((h, i) => {
                if(h == 0) return 0;
                return Math.min(h + healAmount, characterInfo.health[loadoutCards[i]][cardLevels[loadoutCards[i]]-1]);
            }));
        }
        else if(loadoutCards[mainIndex] == 'Mikasa'){
            setIsMikasaCharged(true);
        }
        else if(loadoutCards[mainIndex] == 'Luffy'){
            if(luffyBuffCnt == 0){
                tempAbilityDamages['Luffy'][0] *= 2; 
                tempAbilityDamages['Luffy'][1] *= 2;
                setAbilityDamages(tempAbilityDamages);
            }
            setLuffyBuffCnt(2);
        }
        else if(loadoutCards[mainIndex] == 'Gojo'){
            setGojoBuffCnt(getNumAlive() - 1);
        }
        else if(loadoutCards[mainIndex] == 'Natsu'){
            if(natsuBuffCnt == 0){
                tempAbilityDamages['Natsu'][0] *= 1.5; 
                tempAbilityDamages['Natsu'][1] *= 1.5;
                setAbilityDamages(tempAbilityDamages);
            }
            setNatsuBuffCnt(3);
        }
        handleRotation();
        setIsSpecialAbility(false);
    }, [isSpecialAbility]);
    useEffect(() => { // extra rotate for dead card
        console.log('Extra rotate: ', mainIndex);
        if(isLevelLost || enemyTarget != -1) return;
        if(loadoutHealth[mainIndex] == 0){
            setTimeout(() => {
                if(mainIndex == 2) setIsEnemyTurn(true);
                setIsRotating(false);
                handleRotation();
            }, 400);
        }
    }, [mainIndex, loadoutHealth, enemyTarget]);

    function handleRotation(){ // rotate cards
        const tempX = [...xTransform];
        const tempY = [...yTransform];
        
        tempX.unshift(tempX.pop());
        tempY.unshift(tempY.pop());

        setXTransform(tempX);
        setYTransform(tempY);
        setFirstUpdate(false);
        if(loadoutHealth[(mainIndex + 1) % 3] == 0) setIsRotating(true);
        setMainIndex((mainIndex + 1) % 3);
    }

    function getRandomInt(minRandom, maxRandom){ // random int from [minRandom, maxRandom - 1]
        return minRandom + Math.floor(Math.random() * (maxRandom - minRandom));
    }

    function getNumAlive(){
        let numAlive = 3;
        loadoutHealth.forEach((hp) => {
            if(hp == 0)
                numAlive--;
        })
        return numAlive;
    }
    return (
        <>
            {isLevelBeat ? <VictoryOverlay levelNumber={levelNumber} stagesComplete={stagesComplete} setStagesComplete={setStagesComplete}
            levelPoints={levelPoints} setLevelPoints={setLevelPoints}/> : null}
            {isLevelLost && !isLevelBeat ? <LossOverlay /> : null}
            <div className="level">
                <div className='level-display'>
                    <div className='ally-side'>
                        <div className='ally-reference'>
                            <LevelCard 
                            name={loadoutCards[0]} 
                            xTransform={xTransform} 
                            yTransform={yTransform} 
                            firstUpdate={firstUpdate}
                            loadoutIndex={0}
                            isAlly={true}
                            wasMainIndex={mainIndex == 1}
                            isMainIndex={mainIndex == 0}
                            cardLevels={cardLevels}
                            health={loadoutHealth[0]}
                            wasSpecialAbility={wasSpecialAbility}
                            isBuffed={(isMikasaCharged && loadoutCards[0] == 'Mikasa') || (luffyBuffCnt > 0 && loadoutCards[0] == 'Luffy')
                            || (gojoBuffCnt > 0 && loadoutCards[0] == 'Gojo') || (natsuBuffCnt > 0 && loadoutCards[0] == 'Natsu')
                            }
                            />
                            <LevelCard 
                            name={loadoutCards[1]} 
                            xTransform={xTransform} 
                            yTransform={yTransform} 
                            firstUpdate={firstUpdate}
                            loadoutIndex={1}
                            isAlly={true}
                            wasMainIndex={mainIndex == 2}
                            isMainIndex={mainIndex == 1}
                            cardLevels={cardLevels}
                            health={loadoutHealth[1]}
                            wasSpecialAbility={wasSpecialAbility}
                            isBuffed={(isMikasaCharged && loadoutCards[1] == 'Mikasa') || (luffyBuffCnt > 0 && loadoutCards[1] == 'Luffy')
                            || (gojoBuffCnt > 0 && loadoutCards[1] == 'Gojo') || (natsuBuffCnt > 0 && loadoutCards[1] == 'Natsu')
                            }
                            />
                            <LevelCard 
                            name={loadoutCards[2]} 
                            xTransform={xTransform} 
                            yTransform={yTransform} 
                            firstUpdate={firstUpdate}
                            loadoutIndex={2}
                            isAlly={true}
                            wasMainIndex={mainIndex == 0}
                            isMainIndex={mainIndex == 2}
                            cardLevels={cardLevels}
                            health={loadoutHealth[2]}
                            wasSpecialAbility={wasSpecialAbility}
                            isBuffed={(isMikasaCharged && loadoutCards[2] == 'Mikasa') || (luffyBuffCnt > 0 && loadoutCards[2] == 'Luffy')
                            || (gojoBuffCnt > 0 && loadoutCards[2] == 'Gojo') || (natsuBuffCnt > 0 && loadoutCards[2] == 'Natsu')
                            }
                            />
                        </div>
                    </div>
                    <div className='enemy-side'>
                        <LevelCard 
                        name={enemyName} 
                        enemyLevel={enemyLevel}
                        xTransform={xTransform} 
                        yTransform={yTransform} 
                        firstUpdate={firstUpdate}
                        loadoutIndex={-1}
                        isAlly={false}
                        cardLevels={cardLevels}
                        enemyTarget={enemyTarget}
                        health={isLevelBeat ? 0 : enemyHealth}
                        isParalyzed={isEnemyParalyzed}
                        isBurned={isEnemyBurned}
                        />
                    </div>
                    <button className='game-clicker' style={{ background: characterInfo.bgColors[mainCard]}} 
                    onClick={!isClicking || isEnemyTurn ? null : () => {
                        numClicks.current += 2;
                        setDisplayClicks(numClicks.current); // force rerender
                    }}>
                        {
                            isClicking ? 
                                <>
                                    {
                                    displayClicks == 0 ?
                                    'Click me!'
                                    :
                                    <div className='clicking-display'>
                                        <p className='clicking-display-title'>ATTACK SCORE:</p>
                                        <p>{displayClicks}%</p>
                                    </div>
                                    }
                                    <Ripple color={'black'} duration={1500}/>
                                </>
                            :
                            null
                        }
                        
                    </button>
                </div>
                <div className='level-control-container'>
                    <div className='level-control' style={{ background: `linear-gradient(${characterInfo.bgColors[mainCard]}, #090f15`}}>
                        <div 
                        className='ability'
                        onClick={isClicking || isEnemyTurn ? null : () => {
                            setIsClicking(true);
                        }}>
                            <div className='ability-wrapper'
                            style = {isClicking ? {color: 'black', transform: 'scale(0.9)' } : null}>
                                <p className='ability-title '>{characterInfo.abilities[mainCard][0]}</p>
                                <p className='ability-description ability-damage'>
                                    {abilityDamages[mainCard][0]} - {abilityDamages[mainCard][1]} 
                                </p>
                            </div>
                        </div>
                        <div 
                        className='ability'
                        onClick={isClicking || isEnemyTurn ? null : () => {
                            setIsSpecialAbility(true);
                            setWasSpecialAbility(true);
                        }}>
                            <div className='ability-wrapper'>
                                <p className='ability-title'>{characterInfo.abilities[mainCard][1]}</p>
                                <p className='ability-description'>{characterInfo.abilityDescription[mainCard]}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}