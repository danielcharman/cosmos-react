const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Planet = require('../models/planetModel')

const ConstructionObject = require('../models/constructionObjectModel')

const Mission = require('../models/missionModel')

// @desc    Get user missions
// @route   GET /api/users/:id/missions 
// @access  Private
const getUserMissions = asyncHandler(async (req, res) => {
	const missions = await Mission.find({ user: req.user.id })

	const missionsQueue = await Promise.all(missions.map(async (mission) => {
		let source = await Planet.findById(mission.source)
		let destination = await Planet.findById(mission.destination)

		return {
			mission,
			source,
			destination,
		}
	})); 

    res.status(200).json(missionsQueue)
})

module.exports = {
	getUserMissions,
}