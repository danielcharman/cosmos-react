const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Building = require('../models/buildingModel')
const BuildingsQueue = require('../models/buildingsQueueModel')
const PlanetBuilding = require('../models/planetBuildingModel')

// @desc    Get planet buildings
// @route   GET /api/planets/:id/buildings 
// @access  Private
const getPlanetQueue = asyncHandler(async (req, res) => {
    const buildingsQueue = await BuildingsQueue.find({
		planet: new mongoose.mongo.ObjectId(req.params.planetId),
	}).sort({completed: 'asc'})

	const buildingQueue = await Promise.all(buildingsQueue.map(async (queueItem) => {
		let planetBuilding = await PlanetBuilding.findById(queueItem.building)
		let building = await Building.findById(planetBuilding.building)
		return {
			queueItem,
			building,
		}
	})); 

    // if (!buildingQueue) {
    //     res.status(404)
    //     throw new Error('Planet buildings not found ' + req.params.planetId)
    // }

    // if (planet.user.toString() !== req.user.id) {
    //     res.status(401)
    //     throw new Error('Not Authorized')
    // }

    res.status(200).json({
		buildings: buildingQueue,
		research: [],
		fleet: [],
	})
})

module.exports = {
	getPlanetQueue,
}