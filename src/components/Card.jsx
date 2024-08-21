import '../styles/Card.css';

export default function Card({name, isHighlighted, handleSwapping, cardLevels, levelPoints, handleLevelUp}){
    return (
        <div className='card-wrapper'>
            <div className={`card ${isHighlighted ? 'selected-to-swap' : ''}`} id={name} onClick={handleSwapping}>
                <div className='image-wrapper'>
                    <img src={`/images/${name}.png`} className='card-photo' />
                </div>
                <p>{name} (LV {cardLevels[name]})</p>
            </div>
            {levelPoints > 0 ? 
            <i className='level-up-button fa-solid fa-arrow-up' onClick={() => {handleLevelUp(name)}}>
                
            </i>
            : null}
        </div>
    );
}