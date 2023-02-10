import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { getAllPlanets, colonisePlanet, abandonPlanet } from '../features/planets/planetSlice'

import planetImage from '../assets/img/planet.png'

function Universe() {
    const dispatch = useDispatch()

    const [currentSystem, setCurrentSystem] = useState(null)

    const {
		currentPlanet,
        universe,
	} = useSelector(state => state.planets)

    const {user} = useSelector(state => state.auth)

    const maxPlanets = 15

    useEffect(() => {
        if(currentPlanet) {
            if(currentSystem === null) setCurrentSystem({
                galaxy: currentPlanet.galaxy,
                system: currentPlanet.system
            })
            if(currentSystem) {
                dispatch(getAllPlanets(currentSystem)) 
            }
        }
    }, [ dispatch, currentPlanet, currentSystem ])

    const startMission = (type, data) => {
        console.log('startMission', type, data)
        switch(type) {
            case 'colonise':
                dispatch(colonisePlanet(data)) 
            break;
            case 'abandon':
                dispatch(abandonPlanet(data)) 
            break;
            default:
                console.log('nothing to do')
        }
    }

    if (universe.length === 0 || !currentPlanet || !currentSystem) return <></>

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Universe</small></h1>
            
            <table className='table'>
                <thead>
                    <tr>
                        <th style={{width: 100}}>
                            Vector
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Player
                        </th>
                        <th style={{width: 130}}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>

                    {[...Array(maxPlanets + 1)].map((x, index) => {
                        let planet = false
                        if(index === 0) return true
                        universe.map((planetData) => {
                            if(planetData.position === index) {
                                planet = planetData
                            }
                            return true
                        })

                        if(planet) {
                            return (
                                <tr key={index} className={(planet.user === user._id) ? 'success' : 'danger'}>
                                    <td>
                                        [{currentSystem.galaxy}:{currentSystem.system}:{index}]
                                    </td>
                                    <td>
                                        <img src={planetImage} alt='Cosmos' style={{verticalAlign: 'middle', marginRight: 10, width: '100%', maxWidth: 25, height: 'auto'}} />
                                        {planet.name}
                                    </td>
                                    <td>
                                        Player Name
                                    </td>
                                    <td>
                                        {(planet.user === user._id && planet._id !== currentPlanet._id) && (
                                            <>                                                     
                                                <button className='btn btn-small btn-success' onClick={() => startMission('deployment', planet._id)}>Deployment</button>
                                                
                                                <button className='btn btn-small btn-success' onClick={() => startMission('transport', planet._id)}>Transport</button>
                                            </>
                                        )}

                                        {(planet.user === user._id) && (
                                            <>                                                     
                                                <button className='btn btn-small btn-success' onClick={() => startMission('abandon', planet._id)}>Abandon</button>
                                            </>
                                        )}

                                        {(planet.user !== user._id) && (
                                            <>                                                 
                                                <button className='btn btn-small btn-danger' onClick={() => startMission('espionage', planet._id)}>Espionage</button>

                                                <button className='btn btn-small btn-danger' onClick={() => startMission('attack', planet._id)}>Attack</button>
                                            </>
                                        )}

                                    </td>
                                </tr>
                            )
                        }else{                             
                            return (
                                <tr key={index}>
                                    <td>
                                        [{currentSystem.galaxy}:{currentSystem.system}:{index}]
                                    </td>
                                    <td>
                                        <img src={planetImage} alt='Cosmos' style={{verticalAlign: 'middle', marginRight: 10, width: '100%', maxWidth: 25, height: 'auto'}} />
                                        Unknown
                                    </td>
                                    <td>
                                        Unclaimed
                                    </td>
                                    <td>
                                        <button className='btn btn-small' onClick={() => startMission('colonise', {
                                            vector: JSON.stringify({
                                                ...currentSystem,
                                                position: index
                                            }),
                                            source: currentPlanet._id
                                        })}>Colonise</button>
                                    </td>
                                </tr>
                            )
                        }
                    })}
                </tbody>
            </table>
        </>
    )
}

export default Universe
