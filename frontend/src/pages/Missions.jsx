import { useSelector } from 'react-redux'

import planetImage from '../assets/img/planet.png'

function Missions() {
    const {
		currentPlanet,
	} = useSelector(state => state.planets)

    const {user} = useSelector(state => state.auth)

    if (!currentPlanet) return <></>

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Missions</small></h1>
            
            <table className='table'>
                <thead>
                    <tr>
                        <th>
                            Type
                        </th>
                        <th>
                            Origin
                        </th>
                        <th>
                            Destination
                        </th>
                        <th>
                            Distance
                        </th>
                        <th>
                            Remaining
                        </th>
                        <th style={{width: 100}}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            Type
                        </td>
                        <td>
                            <img src={planetImage} alt='Cosmos' style={{verticalAlign: 'middle', marginRight: 10, width: '100%', maxWidth: 25, height: 'auto'}} /> 
                            Planet Name [1:1:1]
                        </td>
                        <td>
                            <img src={planetImage} alt='Cosmos' style={{verticalAlign: 'middle', marginRight: 10, width: '100%', maxWidth: 25, height: 'auto'}} /> 
                            Planet Name [1:1:1]
                        </td>
                        <td>
                            100,000,000km
                        </td>
                        <td>
                            10mins
                        </td>
                        <td>
                            Actions
                        </td>
                    </tr>
                 
                </tbody>
            </table>
        </>
    )
}

export default Missions
