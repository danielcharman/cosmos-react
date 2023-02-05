const express = require('express')
const router = express.Router({mergeParams: true})

const {
    getPlanetVehicles,
    updatePlanetVehicle,
} = require('../controllers/vehicleController')

const {protect} = require('../middleware/authMiddleware')

router.route('/')
    .get(protect, getPlanetVehicles)
    
router.route('/:planetVehicleId')
    .put(protect, updatePlanetVehicle)

module.exports = router 