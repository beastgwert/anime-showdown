import '../styles/Card.css';

export default function Card({name, isHighlighted, handleSwapping, cardLevels}){
    return (
        <div className='card-wrapper'>
            <div className={`card ${isHighlighted ? 'selected-to-swap' : ''}`} id={name} onClick={handleSwapping}>
                <div className='image-wrapper'>
                    <img src={`/images/${name}.png`} className='card-photo' />
                </div>
                <p>{name} (LV {cardLevels[name]})</p>
            </div>
        </div>
    );
}