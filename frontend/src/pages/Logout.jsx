import { useNavigate } from 'react-router-dom'
import { useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Logout() {
    const navigate = useNavigate()
	const dispatch = useDispatch()

    useEffect(() => {
		dispatch(logout())
		dispatch(reset())
		navigate('/')
    }, [])
	  
    return (
        <></>
    )
  }
  
  export default Logout