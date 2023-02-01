import axios from 'axios'

// const API_URL = '/api/planets'

//get user planets
const getAllPlanets = async(token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get('/api/planets', config)

    return response.data
}

//get user planets
const getUserPlanets = async(userId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get('/api/users/' + userId + '/planets', config)

    return response.data
}

//get planets buildings
const getPlanetBuildings = async(planetId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get('/api/planets/' + planetId + '/buildings', config)

    return response.data
}

const upgradePlanetBuilding = async (planetId, planetBuildingId, level, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
  
    const response = await axios.put('/api/planets/' + planetId + '/buildings/' + planetBuildingId, {level: level}, config)
  
    return response.data
}

const planetService = {
    getUserPlanets,
    getPlanetBuildings,
    upgradePlanetBuilding,
}

export default planetService