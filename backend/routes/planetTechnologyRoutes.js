const express = require('express')
const router = express.Router({mergeParams: true})

const {
    getPlanetTechnologies,
    updatePlanetTechnology,
} = require('../controllers/constructionObjectController')

const {protect} = require('../middleware/authMiddleware')

router.route('/')
    .get(protect, getPlanetTechnologies)
    
router.route('/:planetObjectId')
    .put(protect, updatePlanetTechnology)

module.exports = router 