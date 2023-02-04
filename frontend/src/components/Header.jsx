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
        if(planets.length === 0) dispatch(getUserPlanets())
        if(currentPlanet) dispatch(getPlanetQueue(currentPlanet._id))
    }, [planets])

    useEffect(() => {
        console.log('Starting Game Timer');
		const interval = setInterval(() => {
            dispatch(getUserPlanets())
            if(currentPlanet) dispatch(getPlanetQueue(currentPlanet._id))
            console.log('Running Game Timer');
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
