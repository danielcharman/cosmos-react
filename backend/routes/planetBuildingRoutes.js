const express = require('express')
const router = express.Router({mergeParams: true})

const {
    getPlanetBuildings,
    updatePlanetBuilding,
} = require('../controllers/constructionObjectController')

const {protect} = require('../middleware/authMiddleware')

router.route('/')
    .get(protect, getPlanetBuildings)
    
router.route('/:planetObjectId')
    .put(protect, updatePlanetBuilding)

module.exports = router