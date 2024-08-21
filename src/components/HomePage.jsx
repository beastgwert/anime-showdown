import '../styles/HomePage.css'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie";

export default function HomePage(){
    const navigate = useNavigate();

    const cookies = new Cookies(null, {path: '/'});
    console.log("this is my cookie authorization: ", cookies.get('jwt_authorization'));
    return (
        <div className="homepage-main page">
            <div className='homepage-content'>
                <p>Anime Showdown</p>
                <div className='homepage-caption'><p className='typed-out'>A progression-based card game!</p></div>
                {
                cookies.get('jwt_authorization') ? 
                <button className='play-button' onClick={() => navigate("/play/cards")}>
                    PLAY
                </button>
                :
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        const decodedResponse = jwtDecode(credentialResponse.credential);
                        console.log(decodedResponse.exp);
                        cookies.set("jwt_authorization", credentialResponse.credential, {
                            maxAge: decodedResponse.exp, 
                            path: '/'
                        })
                        navigate("/play/cards");
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
                }
            </div>
            <div className='page-footer'>
                <p><a target="_blank" rel="noopener noreferrer" href="https://tinyurl.com/mru4bk9d">Lofi Anime Wallpaper</a> © 2023</p>
                <p>Pikswell, CC BY-NC-ND 3.0 </p>
            </div>
        </div>
    );
}