const express = require('express')
const router = express.Router({mergeParams: true})

const {
    getPlanetTechnologies,
    updatePlanetTechnology,
} = require('../controllers/technologyController')

const {protect} = require('../middleware/authMiddleware')

router.route('/')
    .get(protect, getPlanetTechnologies)
    
router.route('/:planetTechnologyId')
    .put(protect, updatePlanetTechnology)

module.exports = router 