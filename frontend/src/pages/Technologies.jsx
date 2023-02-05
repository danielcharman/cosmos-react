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

    const onUpgrade = (planetTechnologyId, level) => {
        dispatch(upgradePlanetTechnology({
            planetId: currentPlanet._id, 
            planetTechnologyId: planetTechnologyId, 
            level: level
        }))
        dispatch(getUserPlanets())
        dispatch(getPlanetQueue(currentPlanet._id))
        dispatch(getPlanetTechnologies(currentPlanet._id)) 
        closeModal()
    }

    const isDisabled = (technology) => {
        if(!technology.planetTechnology || technology.planetTechnology.level === 0) return true
        if(!technology.planetTechnology.active) return true
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

    if(currentTechnology && currentTechnology.planetTechnology) {
        duration = getMultipliedValue(
            currentTechnology.technology.duration,
            currentTechnology.technology.durationMultipler,
            (currentTechnology.planetTechnology.level + 1)
        )
        
        production = {
            current: getMultipliedValue(
                        currentTechnology.technology.production,
                        currentTechnology.technology.productionMultipler,
                        (currentTechnology.planetTechnology.level)
                    ),
            next: getMultipliedValue(
                currentTechnology.technology.production,
                currentTechnology.technology.productionMultipler,
                (currentTechnology.planetTechnology.level + 1)
            ), 
        }

        oreCost = getMultipliedValue(
            currentTechnology.technology.ore,
            currentTechnology.technology.oreMultipler,
            (currentTechnology.planetTechnology.level + 1)
        )

        crystalCost = getMultipliedValue(
            currentTechnology.technology.crystal,
            currentTechnology.technology.crystalMultipler,
            (currentTechnology.planetTechnology.level + 1)
        )

        gasCost = getMultipliedValue(
            currentTechnology.technology.gas,
            currentTechnology.technology.crystalMultipler,
            (currentTechnology.planetTechnology.level + 1)
        )
    }

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Technologies</small></h1>

            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                {technologies.map((technology, index) => {
                    var technologyOreCost = getMultipliedValue(
                        technology.technology.ore,
                        technology.technology.oreMultipler,
                        ((technology.planetTechnology ? technology.planetTechnology.level : 1) + 1)
                    )
            
                    var technologyCrystalCost = getMultipliedValue(
                        technology.technology.crystal,
                        technology.technology.crystalMultipler,
                        ((technology.planetTechnology ? technology.planetTechnology.level : 1) + 1)
                    )
            
                    var technologyGasCost = getMultipliedValue(
                        technology.technology.gas,
                        technology.technology.crystalMultipler,
                        ((technology.planetTechnology ? technology.planetTechnology.level : 1) + 1)
                    )

                    return (
                        <div key={index} style={{width: '16.6666%'}}>
                            <div className={'tileItem ' + (isDisabled(technology) && 'disabled') + ' ' + (canAffordAll(technologyOreCost, technologyCrystalCost, technologyGasCost) ? 'tileItem-success' : 'tileItem-danger')} title={technology.technology.name} onClick={() => {
                                if(isDisabled(technology)) return
                                setCurrentTechnology(technology)
                                openModal()
                            }}>
                                <img src={`/assets/img/technology/${technology.technology.name.replace(/ /g,"_")}.jpg`} alt={technology.technology.name} className='img' />
                                <span className={'badge ' + (canAffordAll(technologyOreCost, technologyCrystalCost, technologyGasCost) ? 'badge-success' : 'badge-danger')}>
                                    {(technology.planetTechnology) ? technology.planetTechnology.level : 1}
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
                            <h1 className='modalHeadingText'>{currentTechnology.technology.name}</h1>
                            <button className='modalClose' onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className='modalBody'>
                            {currentTechnology.technology.description}
                            <table className='table' style={{marginTop: 30, fontSize: 13}}>
                                <tbody>
                                    <tr>
                                        <th>Level</th>
                                        <td>
                                            <span className='badge badge-normal'>             
                                                {currentTechnology.planetTechnology.level}
                                            </span> -><span className='badge badge-success'>  
                                                {currentTechnology.planetTechnology.level + 1}
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
                                onUpgrade(currentTechnology.planetTechnology._id, currentTechnology.planetTechnology.level + 1)
                            }}>
                                Upgrade to level {currentTechnology.planetTechnology.level + 1}
                            </button>

                            {(process.env.REACT_APP_DEBUG_MODE === 'true') && (
                                <>
                                    <DebugContainer data={currentTechnology.planetTechnology._id}>
                                        <span>planetTechnology._id:</span>
                                        {currentTechnology.planetTechnology._id}
                                    </DebugContainer>

                                    <DebugContainer data={currentTechnology.planetTechnology.technology}>
                                        <span>planetTechnology.technology:</span>
                                        {currentTechnology.planetTechnology.technology}
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
