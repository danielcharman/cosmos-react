import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserPlanets, getPlanetQueue } from '../features/planets/planetSlice'
import { getPlanetBuildings, upgradePlanetBuilding } from '../features/buildings/buildingSlice'
import Modal from 'react-modal'
import ObjectTile from '../components/ObjectTile'
import ObjectModal from '../components/ObjectModal'

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
    }, [modalIsOpen, currentPlanet, queue, planets, dispatch])

    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    const onUpgrade = (planetObjectId) => {
        dispatch(upgradePlanetBuilding({
            planetId: currentPlanet._id, 
            planetObjectId: planetObjectId, 
        }))
        dispatch(getUserPlanets())
        dispatch(getPlanetQueue(currentPlanet._id))
        dispatch(getPlanetBuildings(currentPlanet._id)) 
        closeModal()
    }

    if (!currentPlanet) return <></>

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Buildings</small></h1>

            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                {buildings.map((building, index) => {
                    return (
                        <ObjectTile key={index} object={building} onClick={() => {
                            setCurrentBuilding(building)
                            openModal()
                        }} />
                    )
                })}
            </div>

            {currentBuilding && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel='Building'
                >
                    <ObjectModal object={currentBuilding} onClose={closeModal} onUpgrade={() => {
                        onUpgrade(currentBuilding.planetObject._id)
                        closeModal()
                    }} />
                </Modal> 
            )}
        </>
    )
}

export default Buildings
