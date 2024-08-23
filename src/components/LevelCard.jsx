import { useState, useEffect, useRef} from 'react';
import '../styles/Card.css';
import {motion} from 'framer-motion';
import characterInfo from '../character-info';

export default function LevelCard({name, enemyLevel, xTransform, yTransform, firstUpdate, loadoutIndex, isAlly, wasMainIndex, isMainIndex, 
    cardLevels, enemyTarget = -1, health, wasSpecialAbility = false, isBuffed = false, isParalyzed = false, isBurned = false, isConfused = false}){
    const totalHealth = characterInfo.health[name][(isAlly ? cardLevels[name] : enemyLevel) -1];
    console.log("LevelCard rerender: ", health, totalHealth, isBuffed);

    return (
        <motion.div 
        className={`motion-wrapper`}
        style = {{opacity: health == 0 ? '0.25' : '1'}}
        initial={isAlly ? {
            transform: `translateX(${xTransform[loadoutIndex]}rem) translateY(${yTransform[loadoutIndex]}rem)`,
        } : {transform: 'translateX(30rem) translateY(-10rem)'}}
        animate={isAlly ? 
            wasMainIndex && !firstUpdate && health != 0 && !wasSpecialAbility ? {
                transform: [null, 'translateX(80rem) translateY(-5rem)', `translateX(${xTransform[loadoutIndex]}rem) translateY(${yTransform[loadoutIndex]}rem)`]
            }
            :
            {
            transform: `translateX(${xTransform[loadoutIndex]}rem) translateY(${yTransform[loadoutIndex]}rem)`,
        } : 
        isParalyzed ? null
        :
        yTransform[enemyTarget] == -10 ? {
            transform: [null, null, 'translateX(-30rem) translateY(-10rem)', 'translateX(30rem) translateY(-10rem)']
        } :
        yTransform[enemyTarget] == -25 ? {
            transform: [null, null, 'translateX(-50rem) translateY(-20rem)', 'translateX(30rem) translateY(-10rem)']
        } :
        yTransform[enemyTarget] == 5 ? {
            transform: [null, null, 'translateX(-50rem) translateY(0rem)', 'translateX(30rem) translateY(-10rem)']
        } : null
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
                          boxShadow: '0 0 15px 1px black'}}>
                    <div className='image-wrapper'>
                        <img src={`/images/${name}.png`} className='card-photo' />
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