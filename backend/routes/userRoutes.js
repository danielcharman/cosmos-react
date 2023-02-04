const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getMe, superDeleteUser} = require('../controllers/userController')

const {protect} = require('../middleware/authMiddleware')

//reroute into note router
const userPlanetRouter = require('./userPlanetRoutes')
router.use('/:userId/planets', userPlanetRouter)

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/superDeleteUser/:userId', superDeleteUser)

router.route('/:id')
    .get(protect, getMe)

module.exports = router