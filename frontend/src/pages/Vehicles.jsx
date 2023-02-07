import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserPlanets, getPlanetQueue } from '../features/planets/planetSlice'
import { getPlanetVehicles, upgradePlanetVehicle } from '../features/vehicles/vehicleSlice'
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

function Vehicles() {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [currentVehicle, setCurrentVehicle] = useState(null)

    const [vehicleBuildQuantity, setVehicleBuildQuantity] = useState(1)

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
    }, [modalIsOpen, currentPlanet, queue, planets])

    const onChangeQuantity = (e) => {
        let quantity = (e.target.value > 1) ? e.target.value : 1;

        setVehicleBuildQuantity(quantity)
    }

    // Open/close modal
    const openModal = () => setModalIsOpen(true)
    const closeModal = () => {
        setModalIsOpen(false)
        setVehicleBuildQuantity(1)
    }

    const getMultipliedValue = (base, quantity) => (base * quantity)

    const onUpgrade = (planetVehicleId) => {
        dispatch(upgradePlanetVehicle({
            planetId: currentPlanet._id, 
            planetVehicleId: planetVehicleId, 
            quantity: vehicleBuildQuantity
        }))
        dispatch(getUserPlanets())
        dispatch(getPlanetQueue(currentPlanet._id))
        dispatch(getPlanetVehicles(currentPlanet._id)) 
        closeModal()
    }

    const isDisabled = (vehicle) => {
        if(!vehicle.planetObject || !vehicle.planetObject.active) return true
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

    let duration, oreCost, crystalCost, gasCost

    if(currentVehicle && currentVehicle.planetObject) {
        duration = getMultipliedValue(
            currentVehicle.object.duration,
            vehicleBuildQuantity
        )

        oreCost = getMultipliedValue(
            currentVehicle.object.ore,
            vehicleBuildQuantity
        )

        crystalCost = getMultipliedValue(
            currentVehicle.object.crystal,
            vehicleBuildQuantity
        )

        gasCost = getMultipliedValue(
            currentVehicle.object.gas,
            vehicleBuildQuantity
        )
    }

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Vehicles</small></h1>

            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                {vehicles.map((vehicle, index) => {
                    var vehicleOreCost = getMultipliedValue(
                        vehicle.object.ore,
                        vehicleBuildQuantity
                    )
            
                    var vehicleCrystalCost = getMultipliedValue(
                        vehicle.object.crystal,
                        vehicleBuildQuantity
                    )
            
                    var vehicleGasCost = getMultipliedValue(
                        vehicle.object.gas,
                        vehicleBuildQuantity
                    )

                    return (
                        <div key={index} style={{width: '16.6666%'}}>
                            <div className={'tileItem ' + (isDisabled(vehicle) && 'disabled')} title={vehicle.object.name} onClick={() => {
                                if(isDisabled(vehicle)) return
                                setCurrentVehicle(vehicle)
                                openModal()
                            }}>
                                <img src={`/assets/img/vehicle/${vehicle.object.name.replace(/ /g,"_")}.jpg`} alt={vehicle.object.name} className='img' />
                                <span className='badge badge-normal'>
                                    {(vehicle.planetObject) ? vehicle.planetObject.amount : 0}
                                </span>
                            </div>
                        </div>
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
                    <div className="modalContent">
                        <div className='modalHeading'>
                            <h1 className='modalHeadingText'>{currentVehicle.object.name}</h1>
                            <button className='modalClose' onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className='modalBody'>
                            {currentVehicle.object.description}
                            <table className='table' style={{marginTop: 30, fontSize: 13}}>
                                <tbody>
                                    <tr>
                                        <th>Current Quantity</th>
                                        <td>
                                            <span className='badge badge-normal'>             
                                                {currentVehicle.planetObject.amount}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '35%'}}>
                                            Production Duration 
                                        </th>
                                        <td style={{width: '65%'}}>
                                            {duration / 60} minute{(duration / 60 > 1) && 's'} <span className='badge badge-normal'>{currentVehicle.object.duration / 60} minute{(currentVehicle.object.duration / 60 > 1) && 's'} / unit</span>
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

                            <input type='number' min='1' className='formControl modalQuantity' id='quantity' name='quantity' placeholder='Quantity' value={vehicleBuildQuantity} onChange={onChangeQuantity} required />

                            <button className={'btn ' + ((canAffordAll(oreCost, crystalCost, gasCost)) ? 'btn-success' : 'btn-danger') + ((!canAffordAll(oreCost, crystalCost, gasCost) || isDisabled(currentVehicle)) ? ' disabled' : '')} onClick={() => {
                                if(isDisabled(currentVehicle)) return
                                onUpgrade(currentVehicle.planetObject._id)
                            }}>
                                Buy Vehicle{(vehicleBuildQuantity > 1) && 's'}
                            </button>

                            {(process.env.REACT_APP_DEBUG_MODE === 'true') && (
                                <>
                                    <DebugContainer data={currentVehicle.planetObject._id}>
                                        <span>planetVehicle._id:</span>
                                        {currentVehicle.planetObject._id}
                                    </DebugContainer>

                                    <DebugContainer data={currentVehicle.planetObject.vehicle}>
                                        <span>planetVehicle.vehicle:</span>
                                        {currentVehicle.planetObject.vehicle}
                                    </DebugContainer> 
                                </>
                            )}   


                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default Vehicles
