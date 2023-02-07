import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getAllPlanets } from '../features/planets/planetSlice'

import planetImage from '../assets/img/planet.png'

function Universe() {
    const dispatch = useDispatch()

    const {
		currentPlanet,
        universe
	} = useSelector(state => state.planets)

    useEffect(() => {
        dispatch(getAllPlanets()) 
    }, [ dispatch ])


    if (!currentPlanet) return <></>

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
                    {universe.map((planet, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    [{planet.galaxy}:{planet.system}:{planet.position}]
                                </td>
                                <td>
                                    <img src={planetImage} alt='Cosmos' style={{verticalAlign: 'middle', marginRight: 10, width: '100%', maxWidth: 25, height: 'auto'}} />
                                    {planet.name}
                                </td>
                                <td>
                                    Player Name
                                </td>
                                <td>
                                    Actions
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

export default Universe
