import { FaGlobe, FaAngleDown } from 'react-icons/fa'
import { useState } from 'react'

function PlanetSelect() {
    const [isOpen, setIsOpen] = useState(false)
    const [planet, setPlanet] = useState({
		id: 2,
		name: 'Titan 2',
		coords: '01:20:02',
	})

	const [planets, setPlanets] = useState([
		{
			id: 1,
			name: 'Titan 1',
			coords: '01:20:01',
		},
		{
			id: 2,
			name: 'Titan 2',
			coords: '01:20:02',
		},
		{
			id: 3,
			name: 'Titan 3',
			coords: '01:20:03',
		},
	])

	const {id: currentPlanetId, name: currentPlanetName, coords: currentPlanetCoords} = planet

    const onToggle = () => {
        setIsOpen(!isOpen)
    }


    return (
		<div className='headerPlanets'>
			<div className='headerPlanetsCurrent' onClick={onToggle}>
				<span className='headerPlanetsPlanet'>
					<FaGlobe className='headerPlanetsIcon' /> 
					<span className='headerPlanetsPlanetName'>{currentPlanetName}</span> 
					<span className='headerPlanetsPlanetCoords'>[{currentPlanetCoords}]</span>
				</span>
				<FaAngleDown className='headerPlanetsSelector' /> 
			</div>
			<ul className={'headerPlanetsOptions ' + ((isOpen) && 'open')}>
				{planets.map((planet) => (
					<li 
						key={planet.id} 
						className={'headerPlanetsOptionsItem ' + 
							((planet.id === currentPlanetId) && 'active')} 
						onClick={() => {
							setPlanet(planet)
							onToggle()
						}}
					>
						<span className='headerPlanetsPlanet'>
							<FaGlobe className='headerPlanetsIcon' />
							<span className='headerPlanetsPlanetName'>{planet.id} {currentPlanetId}{planet.name}</span> 
							<span className='headerPlanetsPlanetCoords'>[{planet.coords}]</span>
						</span>
					</li>
				))}
			</ul>
		</div>
    )
}

export default PlanetSelect