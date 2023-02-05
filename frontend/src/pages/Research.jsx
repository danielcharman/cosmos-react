import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserPlanets, getPlanetQueue } from '../features/planets/planetSlice'
import { getPlanetResearchs, upgradePlanetResearch } from '../features/researchs/researchSlice'
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

function Research() {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [currentResearch, setCurrentResearch] = useState(null)

    const dispatch = useDispatch()

    const {
        currentPlanet,
        planets,
        queue,
	} = useSelector(state => state.planets)

    const {
		researchs, 
	} = useSelector(state => state.researchs)

    useEffect(() => {
        if(currentPlanet) dispatch(getPlanetResearchs(currentPlanet._id)) 
    }, [modalIsOpen, currentPlanet, queue, planets])

    // Open/close modal
    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    const getMultipliedValue = (base, multiplier, level) => (base * (multiplier * level))

    const onUpgrade = (planetResearchId, level) => {
        dispatch(upgradePlanetResearch({
            planetId: currentPlanet._id, 
            planetResearchId: planetResearchId, 
            level: level
        }))
        dispatch(getUserPlanets())
        dispatch(getPlanetQueue(currentPlanet._id))
        dispatch(getPlanetResearchs(currentPlanet._id)) 
        closeModal()
    }

    const isDisabled = (research) => {
        if(research.planetResearch.level === 0) return true
        if(!research.planetResearch.active) return true
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

    if(currentResearch) {
        duration = getMultipliedValue(
            currentResearch.research.duration,
            currentResearch.research.durationMultipler,
            (currentResearch.planetResearch.level + 1)
        )
        
        production = {
            current: getMultipliedValue(
                        currentResearch.research.production,
                        currentResearch.research.productionMultipler,
                        (currentResearch.planetResearch.level)
                    ),
            next: getMultipliedValue(
                currentResearch.research.production,
                currentResearch.research.productionMultipler,
                (currentResearch.planetResearch.level + 1)
            ), 
        }

        oreCost = getMultipliedValue(
            currentResearch.research.ore,
            currentResearch.research.oreMultipler,
            (currentResearch.planetResearch.level + 1)
        )

        crystalCost = getMultipliedValue(
            currentResearch.research.crystal,
            currentResearch.research.crystalMultipler,
            (currentResearch.planetResearch.level + 1)
        )

        gasCost = getMultipliedValue(
            currentResearch.research.gas,
            currentResearch.research.crystalMultipler,
            (currentResearch.planetResearch.level + 1)
        )
    }

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Researchs</small></h1>

            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                {researchs.map((research, index) => {
                    var researchOreCost = getMultipliedValue(
                        research.research.ore,
                        research.research.oreMultipler,
                        (research.planetResearch.level + 1)
                    )
            
                    var researchCrystalCost = getMultipliedValue(
                        research.research.crystal,
                        research.research.crystalMultipler,
                        (research.planetResearch.level + 1)
                    )
            
                    var researchGasCost = getMultipliedValue(
                        research.research.gas,
                        research.research.crystalMultipler,
                        (research.planetResearch.level + 1)
                    )

                    return (
                        <div key={index} style={{width: '16.6666%'}}>
                            <div className={'researchTile ' + (isDisabled(research) && 'disabled') + ' ' + (canAffordAll(researchOreCost, researchCrystalCost, researchGasCost) ? 'researchTile-success' : 'researchTile-danger')} title={research.research.name} onClick={() => {
                                if(isDisabled(research)) return
                                setCurrentResearch(research)
                                openModal()
                            }}>
                                <img src={`/assets/img/research/${research.research.name.replace(/ /g,"_")}.jpg`} alt={research.research.name} className='img' />
                                <span className={'badge ' + (canAffordAll(researchOreCost, researchCrystalCost, researchGasCost) ? 'badge-success' : 'badge-danger')}>
                                    {research.planetResearch.level}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {currentResearch && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel='Add Note'
                >
                    <div className="modalContent">
                        <div className='modalHeading'>
                            <h1 className='modalHeadingText'>{currentResearch.research.name}</h1>
                            <button className='modalClose' onClick={closeModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className='modalBody'>
                            {currentResearch.research.description}
                            <table className='table' style={{marginTop: 30, fontSize: 13}}>
                                <tbody>
                                    <tr>
                                        <th>Level</th>
                                        <td>
                                            <span className='badge badge-normal'>             
                                                {currentResearch.planetResearch.level}
                                            </span> -><span className='badge badge-success'>  
                                                {currentResearch.planetResearch.level + 1}
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

                            <button className={'btn ' + ((canAffordAll(oreCost, crystalCost, gasCost)) ? 'btn-success' : 'btn-danger') + ((!canAffordAll(oreCost, crystalCost, gasCost) || isDisabled(currentResearch)) ? ' disabled' : '')} onClick={() => {
                                if(isDisabled(currentResearch)) return
                                onUpgrade(currentResearch.planetResearch._id, currentResearch.planetResearch.level + 1)
                            }}>
                                Upgrade to level {currentResearch.planetResearch.level + 1}
                            </button>

                            <DebugContainer data={currentResearch.planetResearch._id}>
                                <span>planetResearch._id:</span>
                                {currentResearch.planetResearch._id}
                            </DebugContainer>

                            <DebugContainer data={currentResearch.planetResearch.research}>
                                <span>planetResearch.research:</span>
                                {currentResearch.planetResearch.research}
                            </DebugContainer> 
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default Research
