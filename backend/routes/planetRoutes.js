const express = require('express')
const router = express.Router({mergeParams: true})
const {
    getAllPlanets, 
    getPlanet, 
    createPlanet, 
    updatePlanet, 
    deletePlanet,
    getPlanetBuildings
} = require('../controllers/planetController')

const {protect} = require('../middleware/authMiddleware')

//reroute into note router
const buildingRouter = require('./buildingRoutes')
router.use('/:planetId/buildings', buildingRouter)

//reroute into note router
const queueRouter = require('./queueRoutes')
router.use('/:planetId/queue', queueRouter)

router.route('/')
    .get(protect, getAllPlanets)

router.route('/:id')
    .get(protect, getPlanet)


module.exports = router