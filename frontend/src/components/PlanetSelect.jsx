import { FaGlobe, FaAngleDown } from 'react-icons/fa'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPlanet } from '../features/planets/planetSlice'
import { useNavigate } from 'react-router-dom'

function PlanetSelect() {
    const [isOpen, setIsOpen] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {
		planets, 
		currentPlanet, 
	} = useSelector(state => state.planets)

    const onToggle = () => {
        setIsOpen(!isOpen)
    }

	if(!currentPlanet) return <></>

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
				{planets.map((planet, index) => (
					<li 
					key={index} 
					className={'headerPlanetsOptionsItem ' +  
						((planet._id === currentPlanet._id) && 'active')} 
					onClick={() => {
						dispatch(setCurrentPlanet(planet))
						onToggle()
						navigate('/overview')
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