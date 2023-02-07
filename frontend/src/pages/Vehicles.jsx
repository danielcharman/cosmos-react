import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserPlanets, getPlanetQueue } from '../features/planets/planetSlice'
import { getPlanetVehicles, upgradePlanetVehicle } from '../features/vehicles/vehicleSlice'
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

function Vehicles() {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [currentVehicle, setCurrentVehicle] = useState(null)

    const dispatch = useDispatch()

    const {
        currentPlanet,
        planets,
        queue,
	} = useSelector(state => state.planets)

    const {
		vehicles, 
	} = useSelector(state => state.vehicles)

    useEffect(() => {
        if(currentPlanet) dispatch(getPlanetVehicles(currentPlanet._id)) 
    }, [modalIsOpen, currentPlanet, queue, planets, dispatch])

    const openModal = () => setModalIsOpen(true)
    const closeModal = () => {
        setModalIsOpen(false)
    }

    const onUpgrade = (planetObjectId, amount) => {
        dispatch(upgradePlanetVehicle({
            planetId: currentPlanet._id, 
            planetObjectId: planetObjectId, 
            amount: amount
        }))
        dispatch(getUserPlanets())
        dispatch(getPlanetQueue(currentPlanet._id))
        dispatch(getPlanetVehicles(currentPlanet._id)) 
        closeModal()
    }

    if (!currentPlanet) return <></>

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Vehicles</small></h1>

            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                {vehicles.map((vehicle, index) => {
                    return (
                        <ObjectTile key={index} object={vehicle} onClick={() => {
                            setCurrentVehicle(vehicle)
                            openModal()
                        }} />
                    )
                })}
            </div>

            {currentVehicle && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel='Add Note'
                >
                    <ObjectModal object={currentVehicle} onClose={closeModal} onUpgrade={(amount) => {
                        onUpgrade(currentVehicle.planetObject._id, amount)
                        closeModal()
                    }} />
                </Modal>
            )}
        </>
    )
}

export default Vehicles
