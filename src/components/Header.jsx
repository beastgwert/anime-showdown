import Cookies from 'universal-cookie';
import { googleLogout } from "@react-oauth/google"
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/Header.css'

export default function Header({setOverlay, curPage, changePage}){
    console.log("curpage: ", curPage);
    const navigate = useNavigate();
    const cookies = new Cookies(null, {path: '/'});

    const logOut = () => {
        googleLogout();
        cookies.remove('jwt_authorization', { path: '/'});
        console.log("logged out");
        navigate('/');
    };

    return (
        <header id="header" role='banner'>
            <i id="instructions-button" className='fa-regular fa-circle-question' onClick={setOverlay}></i>
            <nav>
                <Link to='/'>HOME</Link>
                <p className='separator'>/</p>
                <Link to='/play/cards' className={curPage == 'cards' ? 'underline' : ''} onClick={() => changePage('cards')}>CARDS</Link>
                <p className='separator'>/</p>
                <Link to='/play/levels' className={curPage == 'levels' ? 'underline' : ''} onClick={() => changePage('levels')}>LEVELS</Link>
                <p className='separator'>/</p>
                <Link to='/play/credits' className={curPage == 'credits' ? 'underline' : ''} onClick={() => changePage('credits')}>CREDITS</Link>
                <p className='separator'>/</p>
                <a onClick={logOut}>LOG OUT</a>
            </nav>
        </header>
    )
}