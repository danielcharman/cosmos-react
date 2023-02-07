import axios from 'axios'

//get planets vehicles
const getPlanetVehicles = async(planetId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get('/api/planets/' + planetId + '/vehicles', config)

    return response.data
}

const upgradePlanetVehicle = async (planetId, planetObjectId, amount, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
  
    const response = await axios.put('/api/planets/' + planetId + '/vehicles/' + planetObjectId, {amount: amount}, config)
  
    return response.data
}

const vehicleService = {
    getPlanetVehicles,
    upgradePlanetVehicle,
}

export default vehicleService