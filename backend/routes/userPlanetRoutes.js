const express = require('express')
const router = express.Router({mergeParams: true})
const {
    getUserPlanets,
} = require('../controllers/planetController')

const {protect} = require('../middleware/authMiddleware')

//reroute into note router
// const buildingRouter = require('./buildingRoutes')
// router.use('/:planetId/buildings', buildingRouter)

router.route('/')
    .get(protect, getUserPlanets)

module.exports = router