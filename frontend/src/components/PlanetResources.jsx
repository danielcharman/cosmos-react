import { FaGlobe, FaAngleDown } from 'react-icons/fa'
import {useState, useEffect} from 'react'

function PlanetResources() {
    const [isLoading, setIsLoading] = useState(true)
    const [resources, setResources] = useState({
		ore: {
			available: 10000,
			capacity: 1500000,
		},
		crystal: {
			available: 20000,
			capacity: 1500000,
		},
		gas: {
			available: 30000,
			capacity: 1500000,
		}
	})    

    return (
		<ul className='headerResources'>
			<li className='headerResourcesItem'>
				<span className='headerResourcesItemLabel'>Ore</span>
				<span className='headerResourcesItemValue'>{resources.ore.available.toLocaleString('en-US')} / {resources.ore.capacity.toLocaleString('en-US')}</span>
			</li>
			<li className='headerResourcesItem'>
				<span className='headerResourcesItemLabel'>Crystal</span>
				<span className='headerResourcesItemValue'>{resources.crystal.available.toLocaleString('en-US')} / {resources.crystal.capacity.toLocaleString('en-US')}</span>
			</li>
			<li className='headerResourcesItem'>
				<span className='headerResourcesItemLabel'>Gas</span>
				<span className='headerResourcesItemValue low'>{resources.gas.available.toLocaleString('en-US')} / {resources.gas.capacity.toLocaleString('en-US')}</span>
			</li>                
		</ul>
    )
}

export default PlanetResources