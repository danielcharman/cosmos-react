import axios from 'axios'

//get planets missions
const getUserMissions = async(userId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get('/api/users/' + userId + '/missions', config)

    return response.data
}

const missionService = {
    getUserMissions,
}

export default missionService