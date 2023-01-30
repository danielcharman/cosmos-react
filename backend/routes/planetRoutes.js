const express = require('express')
const router = express.Router()
const {
    getPlanets, 
    getPlanet, 
    createPlanet, 
    updatePlanet, 
    deletePlanet,
    getPlanetBuildings
} = require('../controllers/planetController')

const {protect} = require('../middleware/authMiddleware')

router.route('/')
    .get(protect, getPlanets)
    .post(protect, createPlanet)

router.route('/:id')
    .get(protect, getPlanet)
    .delete(protect, deletePlanet)
    .put(protect, updatePlanet)

router.route('/:id/buildings')
    .get(protect, getPlanetBuildings)

module.exports = router