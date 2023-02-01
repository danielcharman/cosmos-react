import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

function PlanetResources() {
    const dispatch = useDispatch()

    const {
		currentPlanet, 
		isLoading, 
	} = useSelector(state => state.planets)

	// if(isLoading) return <></>

    return (
		<ul className='headerResources'>
			<li className='headerResourcesItem'>
				<span className='headerResourcesItemLabel'>Ore</span>
				<span className='headerResourcesItemValue'>
					{new Intl.NumberFormat('en-AU').format(currentPlanet.ore)}
				</span>
			</li>
			<li className='headerResourcesItem'>
				<span className='headerResourcesItemLabel'>Crystal</span>
				<span className='headerResourcesItemValue'>
					{new Intl.NumberFormat('en-AU').format(currentPlanet.crystal)}
				</span>
			</li>
			<li className='headerResourcesItem'>
				<span className='headerResourcesItemLabel'>Gas</span>
				<span className='headerResourcesItemValue low'>
					{new Intl.NumberFormat('en-AU').format(currentPlanet.gas)}
				</span>
			</li>                
		</ul>
    )
}

export default PlanetResources