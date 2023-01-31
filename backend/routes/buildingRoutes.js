const express = require('express')
const router = express.Router({mergeParams: true})

const {
    getAllBuildings, 
    getPlanetBuildings,
} = require('../controllers/buildingController')

const {protect} = require('../middleware/authMiddleware')

router.route('/')
    .get(protect, getPlanetBuildings)

module.exports = router