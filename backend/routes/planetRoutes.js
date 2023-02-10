const express = require('express')
const router = express.Router({mergeParams: true})

const {
    getSystemPlanets,
    colonisePlanet,
    deletePlanet,
} = require('../controllers/planetController')

const {
    createTechnology,
    createVehicle,
} = require('../controllers/constructionObjectController')

const {protect} = require('../middleware/authMiddleware')

//reroute into buildings router
const planetBuildingRouter = require('./planetBuildingRoutes')
router.use('/:planetId/buildings', planetBuildingRouter)

//reroute into technology router
const planetTechnologyRouter = require('./planetTechnologyRoutes')
router.use('/:planetId/technologies', planetTechnologyRouter)

//reroute into vehicles router
const planetVehicleRouter = require('./planetVehicleRoutes')
router.use('/:planetId/vehicles', planetVehicleRouter)

//reroute into queue router
const queueRouter = require('./queueRoutes')
router.use('/:planetId/queue', queueRouter)

router.route('/galaxy/:galaxy/system/:system')
    .get(protect, getSystemPlanets)

router.route('/technology')
    .post(protect, createTechnology)

router.route('/vehicle')
    .post(protect, createVehicle)

router.route('/:planetId')
    .delete(protect, deletePlanet)

router.route('/colonise')
    .post(protect, colonisePlanet)

module.exports = router