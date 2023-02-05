import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserPlanets, getPlanetQueue } from '../features/planets/planetSlice'
import { getPlanetBuildings, upgradePlanetBuilding } from '../features/buildings/buildingSlice'
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-modal'
import DebugContainer from '../components/DebugContainer'

const customStyles = {
    content: {
        width: '600px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        position: 'relative',
        color: '#000',
        borderRadius: '10px',
        padding: '0'
    },
}

Modal.setAppElement('#root')

function Buildings() {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [currentBuilding, setCurrentBuilding] = useState(null)

    const dispatch = useDispatch()

    const {
        currentPlanet,
        planets,
        queue,
	} = useSelector(state => state.planets)

    const {
		buildings, 
	} = useSelector(state => state.buildings)

    useEffect(() => {
        if(currentPlanet) dispatch(getPlanetBuildings(currentPlanet._id)) 
    }, [modalIsOpen, currentPlanet, queue, planets])

    // Open/close modal
    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    const getMultipliedValue = (base, multiplier, level) => (base * (multiplier * level))

    const onUpgrade = (planetBuildingId, level) => {
        dispatch(upgradePlanetBuilding({
            planetId: currentPlanet._id, 
            planetBuildingId: planetBuildingId, 
            level: level
        }))
        dispatch(getUserPlanets())
        dispatch(getPlanetQueue(currentPlanet._id))
        dispatch(getPlanetBuildings(currentPlanet._id)) 
        closeModal()
    }

    const isDisabled = (building) => {
        if(building.planetBuilding.level === 0) return true
        if(!building.planetBuilding.active) return true
        return false
    }

    const canAfford = (cost, resource) => {
        return (cost < resource) ? true : false
    }

    const canAffordAll = (oreCost, crystalCost, gasCost) => {
        if(!canAfford(oreCost, currentPlanet.resources.ore.current)) return false
        if(!canAfford(crystalCost, currentPlanet.resources.crystal.current)) return false
        if(!canAfford(gasCost, currentPlanet.resources.gas.current)) return false
        return true
    }

    if (!currentPlanet) return <></>

    let duration, production, oreCost, crystalCost, gasCost

    if(currentBuilding) {
        duration = getMultipliedValue(
            currentBuilding.building.duration,
            currentBuilding.building.durationMultipler,
            (currentBuilding.planetBuilding.level + 1)
        )
        
        production = {
            current: getMultipliedValue(
                        currentBuilding.building.production,
                        currentBuilding.building.productionMultipler,
                        (currentBuilding.planetBuilding.level)
                    ),
            next: getMultipliedValue(
                currentBuilding.building.production,
                currentBuilding.building.productionMultipler,
                (currentBuilding.planetBuilding.level + 1)
            ), 
        }

        oreCost = getMultipliedValue(
            currentBuilding.building.ore,
            currentBuilding.building.oreMultipler,
            (currentBuilding.planetBuilding.level + 1)
        )

        crystalCost = getMultipliedValue(
            currentBuilding.building.crystal,
            currentBuilding.building.crystalMultipler,
            (currentBuilding.planetBuilding.level + 1)
        )

        gasCost = getMultipliedValue(
            currentBuilding.building.gas,
            currentBuilding.building.crystalMultipler,
            (currentBuilding.planetBuilding.level + 1)
        )
    }

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Buildings</small></h1>

            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                {buildings.map((building, index) => {
                    var buildingOreCost = getMultipliedValue(
                        building.building.ore,
                        building.building.oreMultipler,
                        (building.planetBuilding.level + 1)
                    )
            
                    var buildingCrystalCost = getMultipliedValue(
                        building.building.crystal,
                        building.building.crystalMultipler,
                        (building.planetBuilding.level + 1)
                    )
            
                    var buildingGasCost = getMultipliedValue(
                        building.building.gas,
                        building.building.crystalMultipler,
                        (building.planetBuilding.level + 1)
                    )

                    return (
                        <div key={index} style={{width: '16.6666%'}}>
                            <div className={'buildingTile ' + (isDisabled(building) && 'disabled') + ' ' + (canAffordAll(buildingOreCost, buildingCrystalCost, buildingGasCost) ? 'buildingTile-success' : 'buildingTile-danger')} title={building.building.name} onClick={() => {
                                if(isDisabled(building)) return
                                setCurrentBuilding(building)
                                openModal()
                            }}>
                                <img src={`/assets/img/building/${building.building.name.replace(/ /g,"_")}.jpg`} alt={building.building.name} className='img' />
                                <span className={'badge ' + (canAffordAll(buildingOreCost, buildingCrystalCost, buildingGasCost) ? 'badge-success' : 'badge-danger')}>
                                    {building.planetBuilding.level}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {currentBuilding && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel='Add Note'
                >
                    <div className="modalContent">
                        <div className='modalHeading'>
                            <h1 className='modalHeadingText'>{currentBuilding.building.name}</h1>
                            <button className='modalClose' onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className='modalBody'>
                            {currentBuilding.building.description}
                            <table className='table' style={{marginTop: 30, fontSize: 13}}>
                                <tbody>
                                    <tr>
                                        <th>Level</th>
                                        <td>
                                            <span className='badge badge-normal'>             
                                                {currentBuilding.planetBuilding.level}
                                            </span> -><span className='badge badge-success'>  
                                                {currentBuilding.planetBuilding.level + 1}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '35%'}}>
                                            Upgrade Duration 
                                        </th>
                                        <td style={{width: '65%'}}>
                                            {duration / 60} minutes
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '35%'}}>
                                            Production 
                                        </th>
                                        <td style={{width: '65%'}}>
                                            <span className='badge badge-normal'>
                                                {production.current}
                                            </span> -><span className='badge badge-success'>
                                                {production.next}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Resource Cost</th>
                                        <td>
                                            {oreCost > 0 && (
                                                <div>
                                                    Ore 
                                                    <span className={'badge ' + ((canAfford(oreCost, currentPlanet.resources.ore.current)) ? 'badge-success' : 'badge-danger')} style={{marginLeft: 5}}>
                                                        {oreCost}
                                                    </span>
                                                </div>
                                            )}
                                            {crystalCost > 0 && (
                                                <div>
                                                    Crystal 
                                                    <span className={'badge ' + ((canAfford(crystalCost, currentPlanet.resources.crystal.current)) ? 'badge-success' : 'badge-danger')} style={{marginLeft: 5}}>
                                                        {crystalCost}
                                                    </span>
                                                </div>
                                            )}
                                            {gasCost > 0 && (
                                                <div>
                                                    Gas 
                                                    <span className={'badge ' + ((canAfford(gasCost, currentPlanet.resources.gas.current)) ? 'badge-success' : 'badge-danger')} style={{marginLeft: 5}}>
                                                        {gasCost}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <button className={'btn ' + ((canAffordAll(oreCost, crystalCost, gasCost)) ? 'btn-success' : 'btn-danger') + ((!canAffordAll(oreCost, crystalCost, gasCost) || isDisabled(currentBuilding)) ? ' disabled' : '')} onClick={() => {
                                if(isDisabled(currentBuilding)) return
                                onUpgrade(currentBuilding.planetBuilding._id, currentBuilding.planetBuilding.level + 1)
                            }}>
                                Upgrade to level {currentBuilding.planetBuilding.level + 1}
                            </button>

                            <DebugContainer data={currentBuilding.planetBuilding._id}>
                                <span>planetBuilding._id:</span>
                                {currentBuilding.planetBuilding._id}
                            </DebugContainer>

                            <DebugContainer data={currentBuilding.planetBuilding.building}>
                                <span>planetBuilding.building:</span>
                                {currentBuilding.planetBuilding.building}
                            </DebugContainer> 
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default Buildings
