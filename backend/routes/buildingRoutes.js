const express = require('express')
const router = express.Router()
const {
    getBuildings, 
    getBuilding, 
    createBuilding, 
    updateBuilding, 
    deleteBuilding
} = require('../controllers/buildingController')

const {protect} = require('../middleware/authMiddleware')

router.route('/')
    .get(protect, getBuildings)
    .post(protect, createBuilding)

router.route('/:id')
    .get(protect, getBuilding)
    .delete(protect, deleteBuilding)
    .put(protect, updateBuilding)

module.exports = router