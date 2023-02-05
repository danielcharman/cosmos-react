import HeaderMenu from './HeaderMenu'
import PlanetResources from './PlanetResources'
import PlanetSelect from './PlanetSelect'
import { getUserPlanets, getPlanetQueue } from '../features/planets/planetSlice'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

function Header() {
    const { user } = useSelector((state) => state.auth)

    const {
        planets,
		currentPlanet,
	} = useSelector(state => state.planets)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUserPlanets())
    }, [user])

    useEffect(() => {
        if(planets.length === 0) dispatch(getUserPlanets())
        if(currentPlanet) dispatch(getPlanetQueue(currentPlanet._id))
    }, [planets])

    useEffect(() => {
		const interval = setInterval(() => {
            console.log('Running Game Timer');
            dispatch(getUserPlanets())
            if(currentPlanet) dispatch(getPlanetQueue(currentPlanet._id))
		}, 5000);
	
		return () => clearInterval(interval);
    }, [])

	if(!currentPlanet || !user) return <></>

    return (
        <>
            {user ? (
                <header className='header'>
                    <HeaderMenu />
                    <PlanetResources />
                    <PlanetSelect /> 
                </header>
            ) : (
                <></>
            )}
        </>
    )
}

export default Header
