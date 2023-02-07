import { useSelector } from 'react-redux'

function PlanetResources() {
    const {
		currentPlanet,
	} = useSelector(state => state.planets)

	if(!currentPlanet) return <></>

    return (
		<ul className='headerResources'>
			<li className='headerResourcesItem'>
				Ore
				<span className={'badge ' + ((currentPlanet.resources.ore.current < currentPlanet.resources.ore.capacity && currentPlanet.resources.ore.current > 0) ? 'badge-success' : 'badge-danger')}>
					{new Intl.NumberFormat('en-AU').format(currentPlanet.resources.ore.current)} / {new Intl.NumberFormat('en-AU').format(currentPlanet.resources.ore.capacity)}
				</span>
			</li>
			<li className='headerResourcesItem'>
				Crystal
				<span className={'badge ' + ((currentPlanet.resources.crystal.current < currentPlanet.resources.crystal.capacity && currentPlanet.resources.crystal.current > 0) ? 'badge-success' : 'badge-danger')}>
					{new Intl.NumberFormat('en-AU').format(currentPlanet.resources.crystal.current)} / {new Intl.NumberFormat('en-AU').format(currentPlanet.resources.crystal.capacity)}
				</span>
			</li>
			<li className='headerResourcesItem'>
				Gas
				<span className={'badge ' + ((currentPlanet.resources.gas.current < currentPlanet.resources.gas.capacity && currentPlanet.resources.gas.current > 0) ? 'badge-success' : 'badge-danger')}>
					{new Intl.NumberFormat('en-AU').format(currentPlanet.resources.gas.current)} / {new Intl.NumberFormat('en-AU').format(currentPlanet.resources.gas.capacity)}
				</span>
			</li>                
		</ul>
    )
}

export default PlanetResources