import '../../styles/VictoryOverlay.css'
import { useNavigate } from 'react-router-dom';

export default function VictoryOverlay({levelNumber, stagesComplete, setStagesComplete, levelPoints, setLevelPoints}){
    const navigate = useNavigate();

    return (
        <div className="victory-overlay">
            <div className="victory-overlay-background">
                <div className="victory-overlay-container">
                    {
                        levelNumber == 8 ? 
                        <>
                            <h1>Thanks for playing!</h1>
                            <h2>Stay tuned for future updates</h2>
                        </>
                        :
                        <h1 >Victory!</h1>
                    }
                    <button onClick={() => {
                        
                        if(!stagesComplete.includes(parseInt(levelNumber))) setLevelPoints(parseInt(levelPoints) + 2);
                        let tempStages = [...stagesComplete];
                        if(!tempStages.includes(parseInt(levelNumber))) tempStages.push(parseInt(levelNumber));
                        setStagesComplete(tempStages); 
                        
                        navigate('/play/cards');
                    }}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}