import axios from 'axios'

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
const getPlanetQueue = async(planetId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get('/api/planets/' + planetId + '/queue', config)

    return response.data
}

const planetService = {
    getUserPlanets,
    getPlanetQueue,
}

export default planetService