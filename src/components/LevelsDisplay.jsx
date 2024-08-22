import { useNavigate } from 'react-router-dom';
import characterInfo from '../character-info';
export default function LevelsDisplay({stagesComplete}){
    const navigate = useNavigate();
    console.log("Got to levels display: ", stagesComplete);
    return (
        <>
            <div className="levels-display">
                <div className='levels-column'>
                    <div className='level-button-wrapper'>
                        {stagesComplete.includes(1) ? <img src="/images/crown.png" alt="" /> : null}
                        <button className='level-button' onClick={() => navigate('/play/levels/1')} >
                            <div className='level-description'>
                                <p className='level-title'>{characterInfo.bossNames[0]}</p>
                                <p className='level-caption'>{characterInfo.bossDescriptions[0]} </p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className='levels-column'>
                    <div className='level-button-wrapper'>
                        {stagesComplete.includes(2) ? <img src="/images/crown.png" alt="" /> : null}
                        <button className='level-button' onClick={stagesComplete.includes(1) ? () => navigate('/play/levels/2') : null} 
                        style={stagesComplete.includes(1) ? null : {opacity: '0.3'}}>
                            <div className='level-description'>
                                <p className='level-title'>{characterInfo.bossNames[1]}</p>
                                <p className='level-caption'>{characterInfo.bossDescriptions[1]}</p>
                            </div>
                        </button>
                    </div>
                    <div className='level-button-wrapper'>
                        {stagesComplete.includes(3) ? <img src="/images/crown.png" alt="" /> : null}
                        <button className='level-button' onClick={stagesComplete.includes(1) ? () => navigate('/play/levels/3') : null} 
                        style={stagesComplete.includes(1) ? null : {opacity: '0.3'}}>
                            <div className='level-description'>
                                <p className='level-title'>{characterInfo.bossNames[2]}</p>
                                <p className='level-caption'>{characterInfo.bossDescriptions[2]}</p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className='levels-column'>
                    <div className='level-button-wrapper'>
                        {stagesComplete.includes(4) ? <img src="/images/crown.png" alt="" /> : null}
                        <button className='level-button' onClick={stagesComplete.includes(2) || stagesComplete.includes(3) ? () => navigate('/play/levels/4') : null} 
                        style={stagesComplete.includes(2) || stagesComplete.includes(3) ? null : {opacity: '0.3'}}>
                            <div className='level-description'>
                                <p className='level-title'>{characterInfo.bossNames[3]}</p>
                                <p className='level-caption'>{characterInfo.bossDescriptions[3]} </p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className='levels-column'>
                    <div className='level-button-wrapper'>
                        {stagesComplete.includes(5) ? <img src="/images/crown.png" alt="" /> : null}
                        <button className='level-button' onClick={stagesComplete.includes(4)  ? () => navigate('/play/levels/5') : null} 
                        style={stagesComplete.includes(4) ? null : {opacity: '0.3'}}>
                            <div className='level-description'>
                                <p className='level-title'>{characterInfo.bossNames[4]}</p>
                                <p className='level-caption'>{characterInfo.bossDescriptions[4]} </p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className='levels-column'>
                    <div className='level-button-wrapper'>
                        {stagesComplete.includes(6) ? <img src="/images/crown.png" alt="" /> : null}
                        <button className='level-button' onClick={stagesComplete.includes(5) ? () => navigate('/play/levels/6') : null} 
                        style={stagesComplete.includes(5) ? null : {opacity: '0.3'}}>
                            <div className='level-description'>
                                <p className='level-title'>Kirito</p>
                                <p className='level-caption'>Black Swordsman </p>
                            </div>
                        </button>
                    </div>
                    <div className='level-button-wrapper'>
                        {stagesComplete.includes(7) ? <img src="/images/crown.png" alt="" /> : null}
                        <button className='level-button' onClick={stagesComplete.includes(5) ? () => navigate('/play/levels/7') : null} 
                        style={stagesComplete.includes(5) ? null : {opacity: '0.3'}}>
                            <div className='level-description'>
                                <p className='level-title'>Kirito</p>
                                <p className='level-caption'>Black Swordsman </p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className='levels-column'>
                    <div className='level-button-wrapper'>
                        {stagesComplete.includes(8) ? <img src="/images/crown.png" alt="" /> : null}
                        <button className='level-button' onClick={stagesComplete.includes(6) || stagesComplete.includes(7) ? () => navigate('/play/levels/8') : null} 
                        style={stagesComplete.includes(6) || stagesComplete.includes(7) ? null : {opacity: '0.3'}}>
                            <div className='level-description'>
                                <p className='level-title'>Kirito</p>
                                <p className='level-caption'>Black Swordsman </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div className='page-footer'>
                <p><a target="_blank" rel="noopener noreferrer" href="https://tinyurl.com/mr28akwa">Colorado</a> © 2019</p>
                <p>Andrey Syailev, CC BY-NC 4.0 </p>
            </div>
        </>
    )
}