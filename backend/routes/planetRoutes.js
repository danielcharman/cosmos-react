const express = require('express')
const router = express.Router()
const {
    getPlanets, 
    getPlanet, 
    createPlanet, 
    updatePlanet, 
    deletePlanet
} = require('../controllers/planetController')

const {protect} = require('../middleware/authMiddleware')

router.route('/')
    .get(protect, getPlanets)
    .post(protect, createPlanet)

router.route('/:id')
    .get(protect, getPlanet)
    .delete(protect, deletePlanet)
    .put(protect, updatePlanet)

module.exports = router