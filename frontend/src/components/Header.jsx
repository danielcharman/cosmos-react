import HeaderMenu from './HeaderMenu'
import PlanetResources from './PlanetResources'
import PlanetSelect from './PlanetSelect'

import { useSelector } from 'react-redux'

function Header() {
    const { user } = useSelector((state) => state.auth)

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
