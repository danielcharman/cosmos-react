import { useSelector, useDispatch } from 'react-redux'

import planetImage from '../assets/img/planet.png'

function Overview() {
    const dispatch = useDispatch()

    const {
		currentPlanet, 
		isLoading, 
		isSuccess, 
		isError, 
		message
	} = useSelector(state => state.planets)

    if (isLoading) {
      return 'Loading...'
    }

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Overview</small></h1>
            <div style={{display: 'flex'}}>
                <div style={{width: '50%'}}>
                    <img src={planetImage} alt='Cosmos' style={{width: '300px', height: 'auto'}} />
                </div>
                <div style={{width: '50%', textAlign: 'left'}}>
                    <h2 style={{marginTop: 50}}>{currentPlanet.name}</h2>
                    <table className='table' style={{width: '100%'}}>
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
        </>
        
    )
}

export default Overview
