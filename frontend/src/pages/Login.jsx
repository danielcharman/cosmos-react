import {useState, useEffect} from 'react'
import {toast} from 'react-toastify'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate, Link} from 'react-router-dom'
import {login, reset} from '../features/auth/authSlice'

import planetImage from '../assets/img/planet.png'

function Login() {
    const [formData, setFormData] = useState({
        email: 'hello@danielcharman.com',
        password: 'password',
    })

    const {email, password} = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {user, isLoading, isSuccess, isError, message} = useSelector(state => state.auth)

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }
        
        if(isSuccess || user) {
            navigate('/overview')
        }

        // dispatch(reset())
    }, [isError, isSuccess, user, message, navigate, dispatch])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email,
            password
        }

        dispatch(login(userData))
    }

    if (isLoading) {
      return <></>
    }

    return (
        <>
            <img src={planetImage} alt='Cosmos' className='cosmosImage' />
            <h1 className="pageTitle">Cosmos <small>Login</small></h1>
            <section className='form'>
                <form onSubmit={onSubmit}>
                    <div className='formGroup'>
                        <input type='email' className='formControl' id='email' name='email' value={email} placeholder='Your Email' onChange={onChange} required />
                    </div>
                    <div className='formGroup'>
                        <input type='password' className='formControl' id='password' name='password' value={password} placeholder='Your Password' onChange={onChange} required />
                    </div>
                    <div className='formGroup'>
                        <button className='btn btn-info'>Login</button> or <Link to='/register' className='link'>Register</Link>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Login
