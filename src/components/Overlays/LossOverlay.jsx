import '../../styles/LossOverlay.css'
import { useNavigate } from 'react-router-dom';

export default function LossOverlay(){
    const navigate = useNavigate();

    return (
        <div className="loss-overlay">
            <div className="loss-overlay-background">
                <div className="loss-overlay-container">
                <h1>Better Luck Next Time...</h1>
                <button onClick={() => navigate('/play/levels')}>Continue</button>
                </div>
            </div>
        </div>
    )
}