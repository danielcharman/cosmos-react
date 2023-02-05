import { useSelector } from 'react-redux'
import DebugContainer from '../components/DebugContainer'

import planetImage from '../assets/img/planet.png'

function Overview() {
    const {
		currentPlanet,
	} = useSelector(state => state.planets)

    const {user} = useSelector(state => state.auth)

    if (!currentPlanet) return <></>

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Overview</small></h1>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: '30%'}}>
                    <img src={planetImage} alt='Cosmos' style={{width: '200px', height: 'auto'}} />
                </div>
                <div style={{width: '30%', textAlign: 'left'}}>
                    <h2>{currentPlanet.name}</h2>
                    <table className='table' style={{width: '100%', fontSize: 14}}>
                        <tbody>
                            <tr>
                                <th style={{width: '40%'}}>Capacity</th>
                                <td style={{width: '60%', padding: '5px'}}>
                                    {currentPlanet.size}
                                </td>
                            </tr>
                            <tr>
                                <th>Temperature</th>
                                <td>{currentPlanet.temperature} °C</td>
                            </tr>
                            <tr>
                                <th>Position</th>
                                <td>[{currentPlanet.galaxy}:{currentPlanet.system}:{currentPlanet.position}]</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {(process.env.REACT_APP_DEBUG_MODE === 'true') && (
                <>
                    <DebugContainer data={user._id}>
                        <span>user._id:</span>
                        {user._id}
                    </DebugContainer> 

                    <DebugContainer data={currentPlanet._id}>
                        <span>currentPlanet._id:</span>
                        {currentPlanet._id}
                    </DebugContainer> 
                </>
            )}   
        </>
        
    )
}

export default Overview
