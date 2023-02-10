import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getUserMissions } from '../features/missions/missionSlice'
import Countdown from '../components/Countdown'

import planetImage from '../assets/img/planet.png'

function Missions() {
    const dispatch = useDispatch()

    const {
		missions,
	} = useSelector(state => state.missions)

    useEffect(() => {
        dispatch(getUserMissions()) 
    }, [ dispatch ])

    if (!missions) return <></>

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
                    </tr>
                </thead>
                <tbody>
                    {missions.map((item, index) => {
                        const {mission, source, destination} = item
                 
                        return (
                            <tr key={index}>
                                <td>
                                    {mission.action}
                                </td>
                                <td>
                                    <img src={planetImage} alt='Cosmos' style={{verticalAlign: 'middle', marginRight: 10, width: '100%', maxWidth: 25, height: 'auto'}} /> 
                                    {source.name} [{source.galaxy}:{source.system}:{source.position}]
                                </td>
                                <td>
                                    <img src={planetImage} alt='Cosmos' style={{verticalAlign: 'middle', marginRight: 10, width: '100%', maxWidth: 25, height: 'auto'}} /> 
                                    {destination.name} [{destination.galaxy}:{destination.system}:{destination.position}]
                                </td>
                                <td>
                                    {mission.distance}km
                                </td>
                                <td>
                                    <Countdown initialDate={mission.completed} onComplete={() => console.log('complete')} />
                                </td>
                            </tr>
                        )
                    })}
                 
                </tbody>
            </table>
        </>
    )
}

export default Missions
