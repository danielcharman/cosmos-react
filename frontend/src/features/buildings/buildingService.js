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

const upgradePlanetBuilding = async (planetId, planetBuildingId, level, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
  
    const response = await axios.put('/api/planets/' + planetId + '/buildings/' + planetBuildingId, {level: level}, config)
  
    return response.data
}

const buildingService = {
    getPlanetBuildings,
    upgradePlanetBuilding,
}

export default buildingService