const express = require('express')
const router = express.Router({mergeParams: true})

const {
    getPlanetQueue,
} = require('../controllers/queueController')

const {protect} = require('../middleware/authMiddleware')

router.route('/')
    .get(protect, getPlanetQueue)

module.exports = router