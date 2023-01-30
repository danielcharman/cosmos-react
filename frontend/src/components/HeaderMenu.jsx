import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { FaBars, FaDesktop, FaBuilding, FaFlask, FaPlane, FaSignInAlt, FaUserPlus,FaSignOutAlt } from 'react-icons/fa'
import { useState } from 'react'

function HeaderMenu() {
    const [isOpen, setIsOpen] = useState(false)

    const navigate = useNavigate()
	const dispatch = useDispatch()
    const location = useLocation()
    //const { user } = useSelector((state) => state.auth)

    const onToggle = () => {
        setIsOpen(!isOpen)
    }

	const onLogout = () => {
        onToggle()
		dispatch(logout())
		dispatch(reset())
		navigate('/')
	}

    const isCurrentRoute = (route) => {
        if(route === location.pathname) {
            return true
        }
    }
	  
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
            <li className={'headerMenuItem ' + ((isCurrentRoute('/structures')) && 'active')}>
                <Link to='/structures' onClick={onToggle}>
                    <FaBuilding className='headerMenuItemIcon' />  
                    <span className='headerMenuItemLabel'>Structures</span>
                    <span className='headerMenuItemQueue'>0 / 0</span>
                </Link>
            </li>
            <li className={'headerMenuItem ' + ((isCurrentRoute('/research')) && 'active')}>
                <Link to='/research' onClick={onToggle}>
                    <FaFlask className='headerMenuItemIcon' />  
                    <span className='headerMenuItemLabel'>Research</span>
                    <span className='headerMenuItemQueue'>0 / 0</span>
                </Link>
            </li>
            <li className={'headerMenuItem ' + ((isCurrentRoute('/fleet')) && 'active')}>
                <Link to='/fleet' onClick={onToggle}>
                    <FaPlane className='headerMenuItemIcon' />  
                    <span className='headerMenuItemLabel'>Fleet</span>
                    <span className='headerMenuItemQueue'>0 / 0</span>
                </Link>
            </li>   
            <li className='headerMenuItem' onClick={onLogout}>
                <FaSignOutAlt className='headerMenuItemIcon' />  
                <span className='headerMenuItemLabel'>Logout</span>
            </li>                
        </ul>
    </div>
    )
  }
  
  export default HeaderMenu