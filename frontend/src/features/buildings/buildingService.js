import axios from 'axios'

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

const upgradePlanetBuilding = async (planetId, planetObjectId, amount, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
  
    const response = await axios.put('/api/planets/' + planetId + '/buildings/' + planetObjectId, {amount: amount}, config)
  
    return response.data
}

const buildingService = {
    getPlanetBuildings,
    upgradePlanetBuilding,
}

export default buildingService