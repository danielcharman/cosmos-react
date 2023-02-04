import {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {toast} from 'react-toastify'
import {useSelector, useDispatch} from 'react-redux'
import {register, reset} from '../features/auth/authSlice'

import planetImage from '../assets/img/planet.png'

function Register() {
    const [formData, setFormData] = useState({
        name: 'Daniel',
        email: 'hello@danielcharman.com',
        password: 'password',
        password2: 'password',
    })

    const {name, email, password, password2} = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {user, isLoading, isSuccess, isError, message} = useSelector(state => state.auth)

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }
        
        if(user) {
            navigate('/overview')
        }

        dispatch(reset())
    }, [isError, isSuccess, user, message, navigate, dispatch])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if(password !== password2) {
            toast.error('Passwords do not match')
        }else{
            const userData = {
                name,
                email,
                password
            }

            dispatch(register(userData))
        }
    }

    if (isLoading) {
      return <></>
    }

    return (
        <>
            <img src={planetImage} alt='Cosmos' className='cosmosImage' />
            <h1 className="pageTitle">Cosmos <small>Register</small></h1>
            <section className='form'>
                <form onSubmit={onSubmit}>
                    <div className='formGroup'>
                        <input type='text' className='formControl' id='name' name='name' value={name} placeholder='Your Name' onChange={onChange} required />
                    </div>
                    <div className='formGroup'>
                        <input type='email' className='formControl' id='email' name='email' value={email} placeholder='Your Email' onChange={onChange} required />
                    </div>
                    <div className='formGroup'>
                        <input type='password' className='formControl' id='password' name='password' value={password} placeholder='Your Password' onChange={onChange} required />
                    </div>
                    <div className='formGroup'>
                        <input type='password' className='formControl' id='password2' name='password2' value={password2} placeholder='Confirm Password' onChange={onChange} required />
                    </div>
                    <div className='formGroup'>
                        <button className='btn btn-block'>Register</button> or <Link to='/' className='link'>Login</Link>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Register
