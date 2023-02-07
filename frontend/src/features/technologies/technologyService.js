import axios from 'axios'

//get planets technologies
const getPlanetTechnologies = async(planetId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get('/api/planets/' + planetId + '/technologies', config)

    return response.data
}

const upgradePlanetTechnology = async (planetId, planetObjectId, amount, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
  
    const response = await axios.put('/api/planets/' + planetId + '/technologies/' + planetObjectId, {amount: amount}, config)
  
    return response.data
}

const technologyService = {
    getPlanetTechnologies,
    upgradePlanetTechnology,
}

export default technologyService