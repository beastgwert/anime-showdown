import RingLoader from "react-spinners/RingLoader";
import '../../styles/LoadingPage.css'

export default function LoadingPage(){
    return (
        <div className="loading-page sub-page">
            <h2>Loading...</h2>
            <RingLoader size={200} color='white'/>
        </div>
    )
}