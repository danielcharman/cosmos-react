import axios from 'axios'

//get all planets
const getAllPlanets = async(coords, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get('/api/planets/galaxy/' + coords.galaxy + '/system/' + coords.system, config)
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

//get planets development queue
const getPlanetQueue = async(planetId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get('/api/planets/' + planetId + '/queue', config)
    return response.data
}

//get planets development queue
const colonisePlanet = async(vector, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.post('/api/planets/colonise', vector, config)
    return response.data
}

//get planets development queue
const abandonPlanet = async(planetId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.delete(`/api/planets/${planetId}`, config)
    return response.data
}

const planetService = {
    getAllPlanets,
    getUserPlanets,
    getPlanetQueue,
    colonisePlanet,
    abandonPlanet,
}

export default planetService