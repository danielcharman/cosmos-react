const express = require('express')
const router = express.Router({mergeParams: true})

const {
    getPlanetVehicles,
    updatePlanetVehicle,
} = require('../controllers/constructionObjectController')

const {protect} = require('../middleware/authMiddleware')

router.route('/')
    .get(protect, getPlanetVehicles)
    
router.route('/:planetObjectId')
    .put(protect, updatePlanetVehicle)

module.exports = router 