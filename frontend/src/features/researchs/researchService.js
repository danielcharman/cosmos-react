import axios from 'axios'

//get planets researchs
const getPlanetResearchs = async(planetId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get('/api/planets/' + planetId + '/research', config)

    return response.data
}

const upgradePlanetResearch = async (planetId, planetResearchId, level, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
  
    const response = await axios.put('/api/planets/' + planetId + '/research/' + planetResearchId, {level: level}, config)
  
    return response.data
}

const researchService = {
    getPlanetResearchs,
    upgradePlanetResearch,
}

export default researchService