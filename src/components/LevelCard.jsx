import { useState, useEffect, useRef} from 'react';
import '../styles/Card.css';
import {motion, transform} from 'framer-motion';
import characterInfo from '../character-info';
import { useMediaQuery } from 'react-responsive';

export default function LevelCard({name, enemyLevel, xTransform, yTransform, firstUpdate, loadoutIndex, isAlly, wasMainIndex, isMainIndex, 
    cardLevels, enemyTarget = -1, health, wasSpecialAbility = false, isBuffed = false, isParalyzed = false, isBurned = false, isConfused = false, isTabletOrMobile}){
    const totalHealth = characterInfo.health[name][(isAlly ? cardLevels[name] : enemyLevel) -1];

    const allyInitial = `translateX(${xTransform[loadoutIndex]}rem) translateY(${yTransform[loadoutIndex]}rem)`
    const enemyInitial = !isTabletOrMobile ? 'translateX(30rem) translateY(-10rem)' : 'translateX(-5rem) translateY(-30rem)';
    const allyAttackAnimate = !isTabletOrMobile ? [null, 'translateX(80rem) translateY(-5rem)', `translateX(${xTransform[loadoutIndex]}rem) translateY(${yTransform[loadoutIndex]}rem)`] :
    [null, 'translateX(-5rem) translateY(-30rem)', `translateX(${xTransform[loadoutIndex]}rem) translateY(${yTransform[loadoutIndex]}rem)`];
    console.log("LevelCard rerender: ", health, totalHealth, isBuffed);

    return (
        <motion.div 
        className={`motion-wrapper`}
        style = {{opacity: health == 0 ? '0.25' : '1'}}
        initial={isAlly ? {
            transform: allyInitial,
        } : {transform: enemyInitial}}
        animate={isAlly ? 
            wasMainIndex && !firstUpdate && health != 0 && !wasSpecialAbility ? {
                transform: allyAttackAnimate
            }
            :
            {
            transform: `translateX(${xTransform[loadoutIndex]}rem) translateY(${yTransform[loadoutIndex]}rem)`,
        } : 
        isParalyzed ? null
        :
        (!isTabletOrMobile && yTransform[enemyTarget] == -10) || (isTabletOrMobile && xTransform[enemyTarget] == -5) ? {
            transform: !isTabletOrMobile ? [null, null, 'translateX(-30rem) translateY(-10rem)', 'translateX(30rem) translateY(-10rem)']
            : [null, null, 'translateX(-5rem) translateY(15rem)', 'translateX(-5rem) translateY(-30rem)']
        } :
        (!isTabletOrMobile && yTransform[enemyTarget] == -25) || (isTabletOrMobile && xTransform[enemyTarget] == 10) ? {
            transform: !isTabletOrMobile ? [null, null, 'translateX(-50rem) translateY(-20rem)', 'translateX(30rem) translateY(-10rem)']
            : [null, null, 'translateX(10rem) translateY(25rem)', 'translateX(-5rem) translateY(-30rem)']
        } :
        (!isTabletOrMobile && yTransform[enemyTarget] == 5) || (isTabletOrMobile && xTransform[enemyTarget] == -20) ? {
            transform: !isTabletOrMobile ? [null, null, 'translateX(-50rem) translateY(0rem)', 'translateX(30rem) translateY(-10rem)']
            : [null, null, 'translateX(-20rem) translateY(25rem)', 'translateX(-5rem) translateY(-30rem)']
        } : {
            transform: enemyInitial
        }
        }
        transition={wasMainIndex && !firstUpdate && health != 0 && !wasSpecialAbility ?  {
            duration: 1.5,
            times: [0, 0.3, 1]
        }
        :
        enemyTarget != -1 ? {
            duration: 3,
            times: [0, 0.6, 0.8, 1]
        }
        :
        {
            duration: 0.5,
            ease: 'easeInOut'
        }}>
            <div className={`level-card-wrapper ${isMainIndex ? 'scale-125' : 'scale-75'}`}>
                {isParalyzed ? <p style = {{color: 'yellow'}}>Paralyzed</p> : null}
                {isConfused ? <p style = {{color: 'brown'}}>Confused</p> : null}
                {isBurned ? <p style = {{color: 'orange'}}>Burned</p> : null}
                <div className='card levels-card' id={name}
                style = {{border: isParalyzed ? '2px solid #cdc17c' : isBuffed ? `1rem groove ${characterInfo.bgColors[name]}` : '1px solid black',
                          boxShadow: '0 0 15px 1px black',
                          width: !isTabletOrMobile ? '12rem' : '10rem',
                          height: !isTabletOrMobile ? '20rem' : '16rem'}}>
                    <div className='image-wrapper'>
                        <img src={`/images/${name}.webp`} className='card-photo' />
                    </div>
                    <p>{name} (LV {isAlly ? cardLevels[name] : enemyLevel})</p>
                </div>
                <div className='hp-bar'>
                    <div className='current-hp' 
                    style={{width: `calc(100% * ${health} / ${totalHealth})`, 
                            'backgroundColor': health <= totalHealth / 4 ? 'red' : health <= totalHealth / 2 ? 'yellow' : 'rgb(152, 228, 59)',
                            'borderRadius': health == totalHealth || health == 0 ? '5px' : '5px 0 0 5px',
                            'borderRight': health == totalHealth || health == 0? 'none' : '1px solid black'}}>
                        
                    </div>
                    <p className='hp-number'>{health}/{totalHealth}</p>
                </div>
            </div>
        </motion.div>
    );
}