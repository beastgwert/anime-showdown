import '../../styles/VictoryOverlay.css'
import { useNavigate } from 'react-router-dom';

export default function VictoryOverlay({levelNumber, stagesComplete, setStagesComplete}){
    const navigate = useNavigate();

    return (
        <div className="victory-overlay">
            <div className="victory-overlay-background">
                <div className="victory-overlay-container">
                    <h1 >Victory!</h1>
                    <button onClick={() => {
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