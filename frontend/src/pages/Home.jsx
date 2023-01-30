import {Link} from 'react-router-dom'
import {FaQuestionCircle, FaTicketAlt} from 'react-icons/fa'
import planetImage from '../assets/img/planet.png'

function Home() {
    return (
        <>
            <img src={planetImage} alt='Cosmos' className='homeImage' />
            <h1 class='homeHeading'>Cosmos</h1>
            <p>
                <Link to='/login' className='btn'>Login</Link> or <Link to='/register' className='btn'>Register</Link>
            </p>
        </>
    )
}

export default Home
