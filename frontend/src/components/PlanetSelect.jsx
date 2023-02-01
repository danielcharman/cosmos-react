import { FaGlobe, FaAngleDown } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserPlanets, setCurrentPlanet } from '../features/planets/planetSlice'

function PlanetSelect() {
    const [isOpen, setIsOpen] = useState(false)

    const dispatch = useDispatch()

    const {
		planets, 
		currentPlanet, 
		isSuccess,
		isLoading,
	} = useSelector(state => state.planets)

    useEffect(() => {
        dispatch(getUserPlanets())
    }, [])

    useEffect(() => {
        dispatch(getUserPlanets())
    }, [dispatch])

    const onToggle = () => {
        setIsOpen(!isOpen)
    }

    return (
		<div className='headerPlanets'>
			<div className='headerPlanetsCurrent' onClick={onToggle}>
				<span className='headerPlanetsPlanet'>
					<FaGlobe className='headerPlanetsIcon' /> 
					<span className='headerPlanetsPlanetName'>
						{currentPlanet.name}
					</span> 
					<span className='headerPlanetsPlanetCoords'>
						[{currentPlanet.galaxy}:{currentPlanet.system}:{currentPlanet.position}]
					</span>
				</span>
				<FaAngleDown className='headerPlanetsSelector' /> 
			</div>
			<ul className={'headerPlanetsOptions ' + ((isOpen) && 'open')}>
				{planets.map((planet) => (
					<li 
					key={planet._id} 
					className={'headerPlanetsOptionsItem ' +  
						((planet._id === currentPlanet._id) && 'active')} 
					onClick={() => {
						dispatch(setCurrentPlanet(planet))
						onToggle()
					}}>
						<span className='headerPlanetsPlanet'>
							<FaGlobe className='headerPlanetsIcon' />
							<span className='headerPlanetsPlanetName'>{planet.name}</span> 
							<span className='headerPlanetsPlanetCoords'>[{planet.galaxy}:{planet.system}:{planet.position}]</span>
						</span>
					</li>
				))}
			</ul>
		</div>
    )
}

export default PlanetSelect