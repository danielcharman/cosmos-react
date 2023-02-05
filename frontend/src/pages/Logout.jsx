import { useNavigate } from 'react-router-dom'
import { useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { logout, reset as authReset } from '../features/auth/authSlice'
import { reset as planetReset } from '../features/planets/planetSlice'

function Logout() {
  const navigate = useNavigate()
	const dispatch = useDispatch()

    useEffect(() => {
		dispatch(logout())
		dispatch(authReset())
		dispatch(planetReset())
		navigate('/')
    }, [])
	  
    return (
        <></>
    )
  }
  
  export default Logout