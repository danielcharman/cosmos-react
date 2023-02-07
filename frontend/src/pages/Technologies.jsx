import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserPlanets, getPlanetQueue } from '../features/planets/planetSlice'
import { getPlanetTechnologies, upgradePlanetTechnology } from '../features/technologies/technologySlice'
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
    }, [modalIsOpen, currentPlanet, queue, planets, dispatch])

    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    const onUpgrade = (planetObjectId, level) => {
        dispatch(upgradePlanetTechnology({
            planetId: currentPlanet._id, 
            planetObjectId: planetObjectId
        }))
        dispatch(getUserPlanets())
        dispatch(getPlanetQueue(currentPlanet._id))
        dispatch(getPlanetTechnologies(currentPlanet._id)) 
        closeModal()
    }

    if (!currentPlanet) return <></>

    return (
        <>
            <h1 className="pageTitle">Cosmos <small>Technologies</small></h1>

            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                {technologies.map((technology, index) => {
                    return (
                        <ObjectTile key={index} object={technology} onClick={() => {
                            setCurrentTechnology(technology)
                            openModal()
                        }} />
                    )
                })}
            </div>

            {currentTechnology && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel='Technology'
                >
                    <ObjectModal object={currentTechnology} onClose={closeModal} onUpgrade={() => {
                        onUpgrade(currentTechnology.planetObject._id)
                        closeModal()
                    }} />
                </Modal>
            )}
        </>
    )
}

export default Technologies
