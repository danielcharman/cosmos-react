const express = require('express')
const router = express.Router({mergeParams: true})
// const {} = require('../controllers/planetController')

const {protect} = require('../middleware/authMiddleware')

//reroute into buildings router
const planetBuildingRouter = require('./planetBuildingRoutes')
router.use('/:planetId/buildings', planetBuildingRouter)

//reroute into research router
const planetResearchRouter = require('./planetResearchRoutes')
router.use('/:planetId/research', planetResearchRouter)

//reroute into queue router
const queueRouter = require('./queueRoutes')
router.use('/:planetId/queue', queueRouter)

module.exports = router