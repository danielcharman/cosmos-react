const express = require('express')
const router = express.Router({mergeParams: true})

const {
    createTechnology,
} = require('../controllers/technologyController')

const {protect} = require('../middleware/authMiddleware')

//reroute into buildings router
const planetBuildingRouter = require('./planetBuildingRoutes')
router.use('/:planetId/buildings', planetBuildingRouter)

//reroute into technology router
const planetTechnologyRouter = require('./planetTechnologyRoutes')
router.use('/:planetId/technology', planetTechnologyRouter)

//reroute into queue router
const queueRouter = require('./queueRoutes')
router.use('/:planetId/queue', queueRouter)

router.route('/technology')
    .post(protect, createTechnology)

module.exports = router