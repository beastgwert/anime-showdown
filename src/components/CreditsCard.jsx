import characterInfo from "../character-info";

export default function CreditsCard({name}){
    console.log("artist profile link: ", characterInfo.artistProfiles[name])
    return (
        <div className='card-wrapper credits-card-wrapper'>
            <div className='card credits-card' id={name} style={{width: '15rem', height: '25rem', 
                border: `1rem groove ${characterInfo.bgColors[name]}`
            }}> 
                <a className="cover-link" target="_blank" rel="noopener noreferrer" href={characterInfo.artLinks[name]}></a>
                <div className='image-wrapper'>
                    <img src={`/images/${name}.webp`} className='card-photo' />
                </div>
                <p>{name}</p>
            </div>
            <a className="artist" target="_blank" rel="noopener noreferrer" href={characterInfo.artistProfiles[name]}>
                {characterInfo.artists[name]}
            </a>
        </div>
    );
}