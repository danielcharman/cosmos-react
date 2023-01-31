import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

function PlanetResources() {
    const dispatch = useDispatch()

    const {
		currentPlanet, 
		isLoading, 
		isSuccess, 
		isError, 
		message
	} = useSelector(state => state.planets)

    // useEffect(() => {
	// 	console.log(currentPlanet)
    // }, [])

	//.toLocaleString('en-US')

    return (
		<ul className='headerResources'>
			<li className='headerResourcesItem'>
				<span className='headerResourcesItemLabel'>Ore</span>
				<span className='headerResourcesItemValue'>
					{currentPlanet.ore} / ??
				</span>
			</li>
			<li className='headerResourcesItem'>
				<span className='headerResourcesItemLabel'>Crystal</span>
				<span className='headerResourcesItemValue'>
					{currentPlanet.crystal} / ??
				</span>
			</li>
			<li className='headerResourcesItem'>
				<span className='headerResourcesItemLabel'>Gas</span>
				<span className='headerResourcesItemValue low'>
					{currentPlanet.gas} / ??
				</span>
			</li>                
		</ul>
    )
}

export default PlanetResources