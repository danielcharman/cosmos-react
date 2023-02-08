import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { getAllPlanets } from '../features/planets/planetSlice'

import planetImage from '../assets/img/planet.png'

function Universe() {
    const dispatch = useDispatch()

    const [currentSystem, setCurrentSystem] = useState(null)

    const {
		currentPlanet,
        universe,
	} = useSelector(state => state.planets)

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
    }, [ dispatch, currentPlanet ])

    if (!currentPlanet || !currentSystem) return <></>

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
                        <th style={{width: 100}}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>

                    {[...Array(51)].map((x, index) => {
                        return universe.map((planet, PlanetIndex) => {
                            // console.log(planet.position, (index + 1))
                            if(planet.position === index) {
                                console.log('found you', (index))

                                return (
                                    <tr key={index} className='success'>
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
                                            Friend Request 

                                            Deployment 
                                            Transport 
                                            Espionage 
                                            Attack
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
                                            Colonise
                                        </td>
                                    </tr>
                                )
                            }
                        })                       

                    })}
                </tbody>
            </table>
        </>
    )
}

export default Universe
