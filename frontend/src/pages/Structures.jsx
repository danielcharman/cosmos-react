import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserPlanets, getPlanetBuildings, upgradePlanetBuilding } from '../features/planets/planetSlice'
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-modal'

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

function Structures() {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [currentBuilding, setCurrentBuilding] = useState(null)

    const dispatch = useDispatch()

    const {
        currentPlanet,
		buildings, 
        isLoading,
	} = useSelector(state => state.planets)

    useEffect(() => {
        if(currentPlanet._id) {
            dispatch(getPlanetBuildings(currentPlanet._id))
        } 
    }, [modalIsOpen, currentPlanet])

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

    const canAffordAll = () => {
        if(!canAfford(oreCost, currentPlanet.ore)) return false
        if(!canAfford(crystalCost, currentPlanet.crystal)) return false
        if(!canAfford(gasCost, currentPlanet.gas)) return false
        console.log('true')
        return true
    }

    // if (isLoading) {
    //     return 'Loading'
    // }

    let duration, oreCost, crystalCost, gasCost

    if(currentBuilding) {
        duration = getMultipliedValue(
            currentBuilding.building.duration,
            currentBuilding.building.durationMultipler,
            (currentBuilding.planetBuilding.level + 1)
        )

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
            <h1 className="pageTitle">Cosmos <small>Structures</small></h1>

            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                {buildings.map((building, index) => {
                    return (
                        <div key={index} style={{width: '16.6666%'}}>
                            <div className={'buildingTile ' + (isDisabled(building) && 'disabled')} title={building.building.name} onClick={() => {
                                if(isDisabled(building)) return
                                setCurrentBuilding(building)
                                openModal()
                            }}>
                                <img src={`/assets/img/structure/${building.building.name.replace(/ /g,"_")}.jpg`} alt={building.building.name} className='img' />
                                <span className='badge badge-success'>
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
                            <table className='table' style={{marginTop: 30}}>
                                <tbody>
                                    <tr>
                                        <th>Level</th>
                                        <td>{currentBuilding.planetBuilding.level} > <b>{currentBuilding.planetBuilding.level + 1}</b></td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '35%'}}>
                                            Duration 
                                        </th>
                                        <td style={{width: '65%'}}>
                                            {duration / 60} minutes
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Resources</th>
                                        <td>
                                            <div>
                                                Ore 
                                                <span className={'badge ' + ((canAfford(oreCost, currentPlanet.ore)) ? 'badge-success' : 'badge-danger')} style={{marginLeft: 5}}>
                                                    {oreCost}
                                                </span>
                                            </div>
                                            <div>
                                                Crystal 
                                                <span className={'badge ' + ((canAfford(crystalCost, currentPlanet.crystal)) ? 'badge-success' : 'badge-danger')} style={{marginLeft: 5}}>
                                                    {crystalCost}
                                                </span>
                                            </div>
                                            <div>
                                                Gas 
                                                <span className={'badge ' + ((canAfford(gasCost, currentPlanet.gas)) ? 'badge-success' : 'badge-danger')} style={{marginLeft: 5}}>
                                                    {gasCost}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <button className={'btn ' + ((canAffordAll()) ? 'btn-success' : 'btn-danger') + ((!canAffordAll() || isDisabled(currentBuilding)) ? ' disabled' : '')} onClick={() => {
                                if(isDisabled(currentBuilding)) return
                                onUpgrade(currentBuilding.planetBuilding._id, currentBuilding.planetBuilding.level + 1)
                            }}>
                                Upgrade to level {currentBuilding.planetBuilding.level + 1}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default Structures
