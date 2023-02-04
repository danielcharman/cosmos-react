import { FaBars, FaDesktop, FaBuilding, FaFlask, FaPlane, FaSignOutAlt } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { getPlanetQueue } from '../features/planets/planetSlice'
import Countdown from './Countdown'

function HeaderMenu() {
    const [isOpen, setIsOpen] = useState(false) 

	const dispatch = useDispatch()
    const location = useLocation()

    const {
		currentPlanet, 
		queue,
	} = useSelector(state => state.planets)

    const onToggle = () => {
        setIsOpen(!isOpen)
    }

	const onComplete = () => {
        dispatch(getPlanetQueue(currentPlanet._id))
	}

    const isCurrentRoute = (route) => {
        if(route === location.pathname) {
            return true
        }
    }

	if(!currentPlanet) return <></>
	  
    return (
      <div className="headerMenu">
        <FaBars className='headerMenuIcon' onClick={onToggle} />            
        <ul className={'headerMenuItems ' + ((isOpen) && 'open')}>
            <li className='headerMenuItem'>
                <a to='/overview' onClick={() => navigator.clipboard.writeText(currentPlanet._id)}>
                    <span style={{fontSize: 10}} className='headerMenuItemLabel'>currentPlanet._id: {currentPlanet._id}</span>
                </a>
            </li>
            <li className={'headerMenuItem ' + ((isCurrentRoute('/overview')) && 'active')}>
                <Link to='/overview' onClick={onToggle}>
                    <FaDesktop className='headerMenuItemIcon' />  
                    <span className='headerMenuItemLabel'>Overview</span>
                </Link>
            </li>
            <li className={'headerMenuItem ' + ((isCurrentRoute('/buildings')) && 'active')}>
                <Link to='/buildings' onClick={onToggle}>
                    <FaBuilding className='headerMenuItemIcon' />  
                    <span className='headerMenuItemLabel'>Buildings</span>
                    <span className='badge badge-success'>{(queue.buildings && queue.buildings.length > 0) ? queue.buildings.length : 0}</span>
                </Link>
                {(queue.buildings && queue.buildings.length > 0) && (
                <ul className="headerMenuSubMenu">
                    {queue.buildings.map((queueItem, index) => (
                        <li key={queueItem.queueItem._id}>
                            {queueItem.building.name}
                            <span className="badge badge-success">{queueItem.queueItem.level}</span>
                            <div>{queueItem.queueItem.completed}</div>
                            {(index === 0) 
                                ? <Countdown initialDate={queueItem.queueItem.completed} onComplete={onComplete} />
                                :  <small>In queue</small>
                            }
                        </li>
                    ))}
                </ul>
                )}
            </li>
            <li className={'headerMenuItem ' + ((isCurrentRoute('/research')) && 'active')}>
                <Link to='/research' onClick={onToggle}>
                    <FaFlask className='headerMenuItemIcon' />  
                    <span className='headerMenuItemLabel'>Research</span>
                    <span className='badge badge-success'>{(queue.research && queue.research.length > 0) ? queue.research.length : 0}</span>
                </Link>
                {(queue.research && queue.research.length > 0) && (
                <ul className="headerMenuSubMenu">
                    {queue.research.map((queueItem) => (
                        <li key={queueItem.queueItem._id}>
                            {queueItem.building.name}
                            <span className="badge badge-success">{queueItem.queueItem.level}</span>
                            <Countdown initialDate={queueItem.queueItem.completed} onComplete={onComplete} />
                        </li>
                    ))}
                </ul>
                )}
            </li>
            <li className={'headerMenuItem ' + ((isCurrentRoute('/fleet')) && 'active')}>
                <Link to='/fleet' onClick={onToggle}>
                    <FaPlane className='headerMenuItemIcon' />  
                    <span className='headerMenuItemLabel'>Fleet</span>
                    <span className='badge badge-success'>{(queue.fleet && queue.fleet.length > 0) ? queue.fleet.length : 0}</span>
                </Link>
                {(queue.fleet && queue.fleet.length > 0) && (
                <ul className="headerMenuSubMenu">
                    {queue.fleet.map((queueItem) => (
                        <li key={queueItem.queueItem._id}>
                            {queueItem.building.name}
                            <span className="badge badge-success">{queueItem.queueItem.level}</span>
                            <Countdown initialDate={queueItem.queueItem.completed} onComplete={onComplete} />
                        </li>
                    ))}
                </ul>
                )}
            </li>   
            <li className='headerMenuItem'>
                <Link to='/logout' onClick={onToggle}>
                    <FaSignOutAlt className='headerMenuItemIcon' />  
                    <span className='headerMenuItemLabel'>Logout</span>
                </Link>
            </li>                
        </ul>
    </div>
    )
  }
  
  export default HeaderMenu