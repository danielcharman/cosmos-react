const express = require('express')
const router = express.Router({mergeParams: true})

const {
    getPlanetResearchs,
    updatePlanetResearch,
} = require('../controllers/researchController')

const {protect} = require('../middleware/authMiddleware')

router.route('/')
    .get(protect, getPlanetResearchs)
    
router.route('/:planetResearchId')
    .put(protect, updatePlanetResearch)

module.exports = router