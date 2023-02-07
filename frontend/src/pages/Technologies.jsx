import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserPlanets, getPlanetQueue } from '../features/planets/planetSlice'
import { getPlanetTechnologies, upgradePlanetTechnology } from '../features/technologies/technologySlice'
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

function Technologies() {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [currentTechnology, setCurrentTechnology] = useState(null)

    const dispatch = useDispatch()

    const {
        currentPlanet,
        planets,
        queue,
	} = useSelector(state => state.planets)

    const {
		technologies, 
	} = useSelector(state => state.technologies)

    useEffect(() => {
        if(currentPlanet) dispatch(getPlanetTechnologies(currentPlanet._id)) 
    }, [modalIsOpen, currentPlanet, queue, planets])

    // Open/close modal
    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    const getMultipliedValue = (base, multiplier, level) => (base * (multiplier * level))

    const onUpgrade = (planetObjectId, level) => {
        dispatch(upgradePlanetTechnology({
            planetId: currentPlanet._id, 
            planetObjectId: planetObjectId, 
            amount: level
        }))
        dispatch(getUserPlanets())
        dispatch(getPlanetQueue(currentPlanet._id))
        dispatch(getPlanetTechnologies(currentPlanet._id)) 
        closeModal()
    }

    const isDisabled = (technology) => {
        if(!technology.planetObject || technology.planetObject.amount === 0) return true
        if(!technology.planetObject.active) return true
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

    if(currentTechnology && currentTechnology.planetObject) {
        duration = getMultipliedValue(
            currentTechnology.object.duration,
            currentTechnology.object.durationMultipler,
            (currentTechnology.planetObject.amount + 1)
        )
        
        production = {
            current: getMultipliedValue(
                        currentTechnology.object.production,
                        currentTechnology.object.productionMultipler,
                        (currentTechnology.planetObject.amount)
                    ),
            next: getMultipliedValue(
                currentTechnology.object.production,
                currentTechnology.object.productionMultipler,
                (currentTechnology.planetObject.amount + 1)
            ), 
        }

        oreCost = getMultipliedValue(
            currentTechnology.object.ore,
            currentTechnology.object.oreMultipler,
            (currentTechnology.planetObject.amount + 1)
        )

        crystalCost = getMultipliedValue(
            currentTechnology.object.crystal,
            currentTechnology.object.crystalMultipler,
            (currentTechnology.planetObject.amount + 1)
        )

        gasCost = getMultipliedValue(
            currentTechnology.object.gas,
            currentTechnology.object.crystalMultipler,
            (currentTechnology.planetObject.amount + 1)
        )
    }

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Technologies</small></h1>

            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                {technologies.map((technology, index) => {
                    var technologyOreCost = getMultipliedValue(
                        technology.object.ore,
                        technology.object.oreMultipler,
                        ((technology.planetObject ? technology.planetObject.amount : 1) + 1)
                    )
            
                    var technologyCrystalCost = getMultipliedValue(
                        technology.object.crystal,
                        technology.object.crystalMultipler,
                        ((technology.planetObject ? technology.planetObject.amount : 1) + 1)
                    )
            
                    var technologyGasCost = getMultipliedValue(
                        technology.object.gas,
                        technology.object.crystalMultipler,
                        ((technology.planetObject ? technology.planetObject.amount : 1) + 1)
                    )

                    return (
                        <div key={index} style={{width: '16.6666%'}}>
                            <div className={'tileItem ' + (isDisabled(technology) && 'disabled') + ' ' + (canAffordAll(technologyOreCost, technologyCrystalCost, technologyGasCost) ? 'tileItem-success' : 'tileItem-danger')} title={technology.object.name} onClick={() => {
                                if(isDisabled(technology)) return
                                setCurrentTechnology(technology)
                                openModal()
                            }}>
                                <img src={`/assets/img/technology/${technology.object.name.replace(/ /g,"_")}.jpg`} alt={technology.object.name} className='img' />
                                <span className={'badge ' + (canAffordAll(technologyOreCost, technologyCrystalCost, technologyGasCost) ? 'badge-success' : 'badge-danger')}>
                                    {(technology.planetObject) ? technology.planetObject.amount : 1}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {currentTechnology && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel='Add Note'
                >
                    <div className="modalContent">
                        <div className='modalHeading'>
                            <h1 className='modalHeadingText'>{currentTechnology.object.name}</h1>
                            <button className='modalClose' onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className='modalBody'>
                            {currentTechnology.object.description}
                            <table className='table' style={{marginTop: 30, fontSize: 13}}>
                                <tbody>
                                    <tr>
                                        <th>Level</th>
                                        <td>
                                            <span className='badge badge-normal'>             
                                                {currentTechnology.planetObject.amount}
                                            </span> -><span className='badge badge-success'>  
                                                {currentTechnology.planetObject.amount + 1}
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

                            <button className={'btn ' + ((canAffordAll(oreCost, crystalCost, gasCost)) ? 'btn-success' : 'btn-danger') + ((!canAffordAll(oreCost, crystalCost, gasCost) || isDisabled(currentTechnology)) ? ' disabled' : '')} onClick={() => {
                                if(isDisabled(currentTechnology)) return
                                onUpgrade(currentTechnology.planetObject._id, currentTechnology.planetObject.amount + 1)
                            }}>
                                Upgrade to level {currentTechnology.planetObject.amount + 1}
                            </button>

                            {(process.env.REACT_APP_DEBUG_MODE === 'true') && (
                                <>
                                    <DebugContainer data={currentTechnology.planetObject._id}>
                                        <span>planetObject._id:</span>
                                        {currentTechnology.planetObject._id}
                                    </DebugContainer>

                                    <DebugContainer data={currentTechnology.planetObject.object}>
                                        <span>planetObject.object:</span>
                                        {currentTechnology.planetObject.object}
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

export default Technologies
