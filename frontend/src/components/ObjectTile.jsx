import { useSelector } from 'react-redux'

function ObjectTile({object, onClick}) {

    const {
        currentPlanet,
	} = useSelector(state => state.planets)

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
	
	var buildingOreCost = getMultipliedValue(
		object.object.ore,
		object.object.oreMultiplier,
		((object.planetObject ? object.planetObject.amount : 1) + 1)
	)

	var buildingCrystalCost = getMultipliedValue(
		object.object.crystal,
		object.object.crystalMultiplier,
		((object.planetObject ? object.planetObject.amount : 1) + 1)
	)

	var buildingGasCost = getMultipliedValue(
		object.object.gas,
		object.object.crystalMultiplier,
		((object.planetObject ? object.planetObject.amount : 1) + 1)
	)

    return (
		<div style={{width: '16.6666%'}}>
			<div 
			className={'tileItem ' + (isDisabled(object) && 'disabled') + ' ' + 
				((canAffordAll(buildingOreCost, buildingCrystalCost, buildingGasCost) && canMeetRequirements(object.object.requiredObjects)) ? 'tileItem-success' : 'tileItem-danger')} 
			title={object.object.name} 
			onClick={onClick}>
				<img 
				src={`/assets/img/tile/${object.object.name.replace(/ /g,"_")}.jpg`} 
				alt={object.object.name} 
				className='img' />
				<span 
				className={'badge ' + 
				((canAffordAll(buildingOreCost, buildingCrystalCost, buildingGasCost) && canMeetRequirements(object.object.requiredObjects)) ? 'badge-success' : 'badge-danger')}>
					{(object.planetObject) ? object.planetObject.amount : 1}
				</span>
			</div>
		</div>
    )
}

export default ObjectTile