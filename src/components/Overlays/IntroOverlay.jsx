import '../../styles/IntroOverlay.css'

export default function IntroOverlay({isOpen, onClose, username}){
    return (
        <>
            {isOpen ? (
                <div className="intro-overlay">
                    <div className="intro-overlay-background" onClick={onClose}>
                        <div className="intro-overlay-container">
                            <div className='instructions'>
                                <p className='instructions-greeting'>Hey!</p>
                                <div className='instructions-body'>
                                    <p>I don't know how you got here but you're going to have a blast! Maybe. I hope so. Okay that was a horrible introduction let's try again. </p>

                                    <p>Welcome to Anime Showdown! A game designed to recreate your shower thoughts such as: Luffy pulling out gear 10 and beating the living heck out of Kirito, Sasuke pulling out his sharingan and slicing the living heck out of Kirito, and Saitama pulling out his fist and punching the living heck out of Kirito.</p>

                                    <p>I can already smell your disbelief. Is this guy for real? Yeah I'm for real. A turn-based card game in 2024. With ANIME characters. ANIME CHARACTERS!!! If I could, I would've used cool ass animations to witness Kirito get hit with a kamehameha + domain expansion + rasengan combo in a span of two seconds. Unfortunately, I'm not a game developer so you're stuck staring at cards.</p>

                                    <p>If you didn't get anything don't click off, I promise you don't need to know who Kirito is to enjoy this game. </p>

                                    <p>You're a real one for making it this far; I give you my virtual thanks. If you know me in real life don't talk to me about this game because please don't.</p>

                                    <p>Good luck!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            :
                null
            }        
       </>
    )
}