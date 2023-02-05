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

    // Open/close modal
    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    const getMultipliedValue = (base, multiplier, quantity) => (base * (multiplier * quantity))

    const onUpgrade = (planetVehicleId, quantity) => {
        dispatch(upgradePlanetVehicle({
            planetId: currentPlanet._id, 
            planetVehicleId: planetVehicleId, 
            quantity: quantity
        }))
        dispatch(getUserPlanets())
        dispatch(getPlanetQueue(currentPlanet._id))
        dispatch(getPlanetVehicles(currentPlanet._id)) 
        closeModal()
    }

    const isDisabled = (vehicle) => {
        if(!vehicle.planetVehicle || vehicle.planetVehicle.quantity === 0) return true
        if(!vehicle.planetVehicle.active) return true
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

    if(currentVehicle && currentVehicle.planetVehicle) {
        duration = getMultipliedValue(
            currentVehicle.vehicle.duration,
            currentVehicle.vehicle.durationMultipler,
            (currentVehicle.planetVehicle.quantity + 1)
        )
        
        production = {
            current: getMultipliedValue(
                        currentVehicle.vehicle.production,
                        currentVehicle.vehicle.productionMultipler,
                        (currentVehicle.planetVehicle.quantity)
                    ),
            next: getMultipliedValue(
                currentVehicle.vehicle.production,
                currentVehicle.vehicle.productionMultipler,
                (currentVehicle.planetVehicle.quantity + 1)
            ), 
        }

        oreCost = getMultipliedValue(
            currentVehicle.vehicle.ore,
            currentVehicle.vehicle.oreMultipler,
            (currentVehicle.planetVehicle.quantity + 1)
        )

        crystalCost = getMultipliedValue(
            currentVehicle.vehicle.crystal,
            currentVehicle.vehicle.crystalMultipler,
            (currentVehicle.planetVehicle.quantity + 1)
        )

        gasCost = getMultipliedValue(
            currentVehicle.vehicle.gas,
            currentVehicle.vehicle.crystalMultipler,
            (currentVehicle.planetVehicle.quantity + 1)
        )
    }

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Vehicles</small></h1>

            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                {vehicles.map((vehicle, index) => {
                    var vehicleOreCost = getMultipliedValue(
                        vehicle.vehicle.ore,
                        vehicle.vehicle.oreMultipler,
                        ((vehicle.planetVehicle ? vehicle.planetVehicle.quantity : 1) + 1)
                    )
            
                    var vehicleCrystalCost = getMultipliedValue(
                        vehicle.vehicle.crystal,
                        vehicle.vehicle.crystalMultipler,
                        ((vehicle.planetVehicle ? vehicle.planetVehicle.quantity : 1) + 1)
                    )
            
                    var vehicleGasCost = getMultipliedValue(
                        vehicle.vehicle.gas,
                        vehicle.vehicle.crystalMultipler,
                        ((vehicle.planetVehicle ? vehicle.planetVehicle.quantity : 1) + 1)
                    )

                    return (
                        <div key={index} style={{width: '16.6666%'}}>
                            <div className={'tileItem ' + (isDisabled(vehicle) && 'disabled') + ' ' + (canAffordAll(vehicleOreCost, vehicleCrystalCost, vehicleGasCost) ? 'tileItem-success' : 'tileItem-danger')} title={vehicle.vehicle.name} onClick={() => {
                                if(isDisabled(vehicle)) return
                                setCurrentVehicle(vehicle)
                                openModal()
                            }}>
                                <img src={`/assets/img/vehicle/${vehicle.vehicle.name.replace(/ /g,"_")}.jpg`} alt={vehicle.vehicle.name} className='img' />
                                <span className={'badge ' + (canAffordAll(vehicleOreCost, vehicleCrystalCost, vehicleGasCost) ? 'badge-success' : 'badge-danger')}>
                                    {(vehicle.planetVehicle) ? vehicle.planetVehicle.quantity : 1}
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
                            <h1 className='modalHeadingText'>{currentVehicle.vehicle.name}</h1>
                            <button className='modalClose' onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className='modalBody'>
                            {currentVehicle.vehicle.description}
                            <table className='table' style={{marginTop: 30, fontSize: 13}}>
                                <tbody>
                                    <tr>
                                        <th>Current Quantity</th>
                                        <td>
                                            <span className='badge badge-normal'>             
                                                {currentVehicle.planetVehicle.quantity}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{width: '35%'}}>
                                            Production Duration 
                                        </th>
                                        <td style={{width: '65%'}}>
                                            {duration / 60} minutes / unit
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

                            <input type='text' className='formControl modalQuantity' id='quantity' name='quantity' placeholder='Quantity' defaultValue='1' required />

                            <button className={'btn ' + ((canAffordAll(oreCost, crystalCost, gasCost)) ? 'btn-success' : 'btn-danger') + ((!canAffordAll(oreCost, crystalCost, gasCost) || isDisabled(currentVehicle)) ? ' disabled' : '')} onClick={() => {
                                if(isDisabled(currentVehicle)) return
                                onUpgrade(currentVehicle.planetVehicle._id, currentVehicle.planetVehicle.quantity + 1)
                            }}>
                                Buy Vehicle(s)
                            </button>

                            <DebugContainer data={currentVehicle.planetVehicle._id}>
                                <span>planetVehicle._id:</span>
                                {currentVehicle.planetVehicle._id}
                            </DebugContainer>

                            <DebugContainer data={currentVehicle.planetVehicle.vehicle}>
                                <span>planetVehicle.vehicle:</span>
                                {currentVehicle.planetVehicle.vehicle}
                            </DebugContainer> 
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default Vehicles
