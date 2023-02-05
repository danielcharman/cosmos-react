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

const upgradePlanetVehicle = async (planetId, planetVehicleId, quantity, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
  
    const response = await axios.put('/api/planets/' + planetId + '/vehicles/' + planetVehicleId, {quantity: quantity}, config)
  
    return response.data
}

const vehicleService = {
    getPlanetVehicles,
    upgradePlanetVehicle,
}

export default vehicleService