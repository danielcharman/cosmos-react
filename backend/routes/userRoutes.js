const express = require('express')
const router = express.Router()
const {registerUser, loginUser, superDeleteUser, linkUserPlanet} = require('../controllers/userController')

const {protect} = require('../middleware/authMiddleware')

//reroute into user planet router
const userPlanetRouter = require('./userPlanetRoutes')
router.use('/:userId/planets', userPlanetRouter)

//reroute into user mission router
const userMissionRouter = require('./userMissionRoutes')
router.use('/:userId/missions', userMissionRouter)

router.post('/', registerUser)
router.post('/login', loginUser)

router.get('/superDeleteUser/:userId', superDeleteUser)
router.get('/linkUserPlanet/:planetId', linkUserPlanet)

module.exports = router