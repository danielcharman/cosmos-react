import { useSelector } from 'react-redux'
import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import DebugContainer from '../components/DebugContainer'

function ObjectModal({object, onClose, onUpgrade}) {

    const [vehicleBuildQuantity, setVehicleBuildQuantity] = useState(1)

    const {
        currentPlanet,
	} = useSelector(state => state.planets)    
	
	const onChangeQuantity = (e) => {
        let quantity = (e.target.value > 1) ? e.target.value : 1;
        setVehicleBuildQuantity(quantity)
    }

    const canAfford = (cost, resource) => {
        return (cost <= resource) ? true : false
    }

    const canAffordAll = (oreCost, crystalCost, gasCost) => {
        if(!canAfford(oreCost, currentPlanet.resources.ore.current)) return false
        if(!canAfford(crystalCost, currentPlanet.resources.crystal.current)) return false
        if(!canAfford(gasCost, currentPlanet.resources.gas.current)) return false
        return true
    }    
	
	const canMeetRequirements = (requirements) => {
        let result = true
        requirements.map((requiredObject, index) => {
            if(requiredObject.level > requiredObject.amount) result = false
            return true
        })
        return result
    }

    const getMultipliedValue = (base, multiplier, level) => ((base * (multiplier * level)).toFixed(0))

    const isDisabled = (object) => {
        if(!object.planetObject || object.planetObject.level === 0) return true
        if(!object.planetObject.active) return true
        return false
    }

	if(!object.planetObject) return <></>

    let duration, production, oreCost, crystalCost, gasCost

	if(object.object.type === 'Vehicle') {
        duration = getMultipliedValue(object.object.duration, 1, vehicleBuildQuantity)
        oreCost = getMultipliedValue(object.object.ore, 1, vehicleBuildQuantity)
        crystalCost = getMultipliedValue(object.object.crystal, 1, vehicleBuildQuantity)
        gasCost = getMultipliedValue(object.object.gas, 1, vehicleBuildQuantity)
		production = {}
	}else{
		duration = getMultipliedValue(object.object.duration, object.object.durationMultiplier, (object.planetObject.amount + 1))
	
		oreCost = getMultipliedValue(object.object.ore, object.object.oreMultiplier, (object.planetObject.amount + 1))
	
		crystalCost = getMultipliedValue(object.object.crystal, object.object.crystalMultiplier, (object.planetObject.amount + 1))
	
		gasCost = getMultipliedValue(object.object.gas, object.object.crystalMultiplier, (object.planetObject.amount + 1))    
		
		production = {
			current: getMultipliedValue(
				object.object.production, object.object.productionMultiplier, (object.planetObject.amount)
			),
			next: getMultipliedValue(
				object.object.production, object.object.productionMultiplier, (object.planetObject.amount + 1)
			), 
		}
	}

  

    return (
		<div className="modalContent">
			<div className='modalHeading'>
				<h1 className='modalHeadingText'>{object.object.name}</h1>
				<button className='modalClose' onClick={onClose}>
					<FaTimes />
				</button>
			</div>
			<div className='modalBody'>
				{object.object.description}
				<table className='table' style={{marginTop: 30, fontSize: 13}}>
					<tbody>
						{(object.object.type !== 'Vehicle') && (
							<>
								<tr>
									<th>Level</th>
									<td>
										<span className='badge badge-normal'>             
											{object.planetObject.amount}
										</span> -><span className='badge badge-success'>  
											{object.planetObject.amount + 1}
										</span>
									</td>
								</tr>
								<tr>
									<th style={{width: '35%'}}>
										Upgrade Duration 
									</th>
									<td style={{width: '65%'}}>
										{(duration / 60).toFixed(2)} minutes
									</td>
								</tr>
								<tr>
									<th style={{width: '35%'}}>
										Production Rate
									</th>
									<td style={{width: '65%'}}>
										<span className='badge badge-normal'>
											{new Intl.NumberFormat('en-AU').format(production.current)} / hour
										</span> -><span className='badge badge-success'>
											{new Intl.NumberFormat('en-AU').format(production.next)} / hour
										</span>
									</td>
								</tr>
							</>
						)}

						{(object.object.type === 'Vehicle') && (
							<>
								<tr>
									<th>Quantity</th>
									<td>
									<span className='badge badge-normal'>             
											{object.planetObject.amount}
										</span> +
										<span className='badge badge-success'>             
											{vehicleBuildQuantity}
										</span>
									</td>
								</tr>
								<tr>
									<th style={{width: '35%'}}>
										Build Duration 
									</th>
									<td style={{width: '65%'}}>
										{(duration / 60).toFixed(2)} minute{(duration / 60 > 1) && 's'} 
										<span className='badge badge-normal'>
											{(object.object.duration / 60).toFixed(2)} minute{(object.object.duration / 60 > 1) && 's'} / unit
										</span>
									</td>
								</tr>
							</>
						)}

						<tr>
							<th>Resource Cost</th>
							<td>
								{oreCost > 0 && (
									<div>
										Ore 
										<span className={'badge ' + ((canAfford(oreCost, currentPlanet.resources.ore.current)) ? 'badge-success' : 'badge-danger')} style={{marginLeft: 5}}>
											{new Intl.NumberFormat('en-AU').format(oreCost)}
										</span>
									</div>
								)}
								{crystalCost > 0 && (
									<div>
										Crystal 
										<span className={'badge ' + ((canAfford(crystalCost, currentPlanet.resources.crystal.current)) ? 'badge-success' : 'badge-danger')} style={{marginLeft: 5}}>
											{new Intl.NumberFormat('en-AU').format(crystalCost)}
										</span>
									</div>
								)}
								{gasCost > 0 && (
									<div>
										Gas 
										<span className={'badge ' + ((canAfford(gasCost, currentPlanet.resources.gas.current)) ? 'badge-success' : 'badge-danger')} style={{marginLeft: 5}}>
											{new Intl.NumberFormat('en-AU').format(gasCost)}
										</span>
									</div>
								)}
							</td>
						</tr>

						{(object.object.requiredObjects.length > 0) && (
							<tr>
								<th style={{width: '35%'}}>
									Requirements 
								</th>
								<td style={{width: '65%'}}>
									{object.object.requiredObjects.map((requiredObject, index) => {
										return (
											<div key={index}>
												{requiredObject.name} 
												<span className={'badge ' + ((requiredObject.amount >= requiredObject.level) ? 'badge-success' : 'badge-danger')} style={{marginLeft: 5}}>
													{requiredObject.level} 
												</span>
											</div>
										)
									})}
								</td>
							</tr>
						)}            
						
					</tbody>
				</table>

				{(object.object.type === 'Vehicle') && (
					<>
						<input 
							type='number' 
							min='1' 
							className='formControl modalQuantity' 
							id='quantity' 
							name='quantity' 
							placeholder='Quantity' 
							value={vehicleBuildQuantity} 
							onChange={onChangeQuantity} 
							required />

						<button 
						className={'btn ' + 
							((canAffordAll(oreCost, crystalCost, gasCost) && canMeetRequirements(object.object.requiredObjects)) ? 'btn-success' : 'btn-danger') + 
							((!canAffordAll(oreCost, crystalCost, gasCost) || !canMeetRequirements(object.object.requiredObjects)) ? ' disabled' : '')} 
						onClick={() => {
							if(!isDisabled(object)) onUpgrade(vehicleBuildQuantity)
						}}>
							Buy Vehicle{(vehicleBuildQuantity > 1) && 's'}
						</button>
					</>
				)}

				{(object.object.type !== 'Vehicle') && (
					<button
					className={'btn ' + 
						((canAffordAll(oreCost, crystalCost, gasCost) && canMeetRequirements(object.object.requiredObjects)) ? 'btn-success' : 'btn-danger') + 
						((!canAffordAll(oreCost, crystalCost, gasCost) || !canMeetRequirements(object.object.requiredObjects) || isDisabled(object)) ? ' disabled' : '')} 
					onClick={() => {
						if(!isDisabled(object)) onUpgrade()
					}}>
						Upgrade to level {object.planetObject.amount + 1}
					</button>
				)}

				{(process.env.REACT_APP_DEBUG_MODE === 'true') && (
					<>
						<DebugContainer data={object.planetObject._id}>
							<span>planetObject._id:</span>
							{object.planetObject._id}
						</DebugContainer> 

						<DebugContainer data={object.planetObject.object}>
							<span>planetObject.object:</span>
							{object.planetObject.object}
						</DebugContainer>  
					</>
				)}   
			</div>
		</div>
    )
}

export default ObjectModal