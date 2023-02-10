const express = require('express')
const router = express.Router({mergeParams: true})
const {
    getUserMissions,
} = require('../controllers/missionController')

const {protect} = require('../middleware/authMiddleware')

router.route('/')
    .get(protect, getUserMissions)

module.exports = router