import { FaBars, FaDesktop, FaBuilding, FaFlask, FaPlane, FaSignOutAlt, FaGlobe, FaMap } from 'react-icons/fa'
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
                    <span className={'badge ' + ((queue.buildings && queue.buildings.length > 0) ? 'badge-success' : 'badge-normal')}>
                        {(queue.buildings && queue.buildings.length > 0) ? queue.buildings.length : 0}
                    </span>
                </Link>
                {(queue.buildings && queue.buildings.length > 0) && (
                <ul className="headerMenuSubMenu">
                    {queue.buildings.map((queueItem, index) => (
                        <li key={queueItem.queueItem._id}>
                            {queueItem.object.name}
                            <span className="badge badge-success">{queueItem.queueItem.amount}</span>
                            {(index === 0) 
                                ? <Countdown initialDate={queueItem.queueItem.completed} onComplete={onComplete} />
                                :  <small>In queue</small>
                            }
                        </li>
                    ))}
                </ul>
                )}
            </li>
            <li className={'headerMenuItem ' + ((isCurrentRoute('/technology')) && 'active')}>
                <Link to='/technologies' onClick={onToggle}>
                    <FaFlask className='headerMenuItemIcon' />  
                    <span className='headerMenuItemLabel'>Technologies</span>
                    <span className={'badge ' + ((queue.technologies && queue.technologies.length > 0) ? 'badge-success' : 'badge-normal')}>
                        {(queue.technologies && queue.technologies.length > 0) ? queue.technologies.length : 0}
                    </span>
                </Link>
                {(queue.technologies && queue.technologies.length > 0) && (
                <ul className="headerMenuSubMenu">
                    {queue.technologies.map((queueItem, index) => (
                        <li key={queueItem.queueItem._id}>
                            {queueItem.object.name}
                            <span className="badge badge-success">{queueItem.queueItem.amount}</span>
                            {(index === 0) 
                                ? <Countdown initialDate={queueItem.queueItem.completed} onComplete={onComplete} />
                                :  <small>In queue</small>
                            }
                        </li>
                    ))}
                </ul>
                )}
            </li>
            <li className={'headerMenuItem ' + ((isCurrentRoute('/vehicles')) && 'active')}>
                <Link to='/vehicles' onClick={onToggle}>
                    <FaPlane className='headerMenuItemIcon' />  
                    <span className='headerMenuItemLabel'>Vehicles</span>
                    <span className={'badge ' + ((queue.vehicles && queue.vehicles.length > 0) ? 'badge-success' : 'badge-normal')}>
                        {(queue.vehicles && queue.vehicles.length > 0) ? queue.vehicles.length : 0}
                    </span>
                </Link>
                {(queue.vehicles && queue.vehicles.length > 0) && (
                <ul className="headerMenuSubMenu">
                    {queue.vehicles.map((queueItem, index) => (
                        <li key={queueItem.queueItem._id}>
                            {queueItem.object.name}
                            <span className="badge badge-success">{queueItem.queueItem.amount}</span>
                            {(index === 0) 
                                ? <Countdown initialDate={queueItem.queueItem.completed} onComplete={onComplete} />
                                :  <small>In queue</small>
                            }
                        </li>
                    ))}
                </ul>
                )}
            </li>   
            <li className='headerMenuItem'>
                <Link to='/universe' onClick={onToggle}>
                    <FaGlobe className='headerMenuItemIcon' />  
                    <span className='headerMenuItemLabel'>Universe</span>
                </Link>
            </li>  
            <li className='headerMenuItem'>
                <Link to='/missions' onClick={onToggle}>
                    <FaMap className='headerMenuItemIcon' />  
                    <span className='headerMenuItemLabel'>Missions</span>
                </Link>
            </li> 
            <li className='headerMenuItem'>
                <Link to='/logout' onClick={onToggle}>
                    <FaSignOutAlt className='headerMenuItemIcon' />  
                    <span className='headerMenuItemLabel'>Logout</span>
                </Link>
            </li>   

            {(process.env.REACT_APP_DEBUG_MODE === 'true') && (
                <li className='headerMenuItem'>
                    <a href='/' onClick={() => navigator.clipboard.writeText(currentPlanet._id)}>
                        <span style={{fontSize: 10}} className='headerMenuItemLabel'>currentPlanet._id: {currentPlanet._id}</span>
                    </a>
                </li> 
            )}              
        </ul>
    </div>
    )
  }
  
  export default HeaderMenu