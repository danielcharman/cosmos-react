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

    if (isLoading) {
        return 'Loading'
    }

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Structures</small></h1>

            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                {buildings.map((building, index) => {
                    const level = building.planetBuilding ? building.planetBuilding.level : 0

                    return (
                        <div key={index} style={{width: '16.6666%'}}>
                            <div className={'buildingTile ' + (level === 0 && 'disabled')} title={building.building.name} onClick={() => {
                                if(level === 0) return
                                setCurrentBuilding(building)
                                openModal()
                            }}>
                                <img src={`/assets/img/structure/${building.building.name.replace(/ /g,"_")}.jpg`} alt={building.building.name} className='img' />
                                <span className='badge badge-success'>
                                    {level}
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
                                        <th>Next Level</th>
                                        <td>{currentBuilding.planetBuilding.level} > <b>{currentBuilding.planetBuilding.level + 1}</b></td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '35%'}}>
                                            Duration 
                                        </th>
                                        <td style={{width: '65%'}}>
                                            {getMultipliedValue(
                                                currentBuilding.building.duration,
                                                currentBuilding.building.durationMultipler,
                                                (currentBuilding.planetBuilding.level + 1)
                                            ) / 60} minutes
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Resources</th>
                                        <td>
                                            <div>
                                                Ore 
                                                <span className={'badge badge-success'} style={{marginLeft: 5}}>
                                                    {getMultipliedValue(
                                                        currentBuilding.building.ore,
                                                        currentBuilding.building.oreMultipler,
                                                        (currentBuilding.planetBuilding.level + 1)
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                Crystal 
                                                <span className={'badge badge-success'} style={{marginLeft: 5}}>
                                                    {getMultipliedValue(
                                                        currentBuilding.building.crystal,
                                                        currentBuilding.building.crystalMultipler,
                                                        (currentBuilding.planetBuilding.level + 1)
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                Gas 
                                                <span className={'badge badge-success'} style={{marginLeft: 5}}>
                                                    {getMultipliedValue(
                                                        currentBuilding.building.gas,
                                                        currentBuilding.building.crystalMultipler,
                                                        (currentBuilding.planetBuilding.level + 1)
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <button className="btn btn-success" onClick={() => onUpgrade(currentBuilding.planetBuilding._id, currentBuilding.planetBuilding.level + 1)}>
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
