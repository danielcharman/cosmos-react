const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Planet = require('../models/planetModel')

const Building = require('../models/buildingModel')
const BuildingsQueue = require('../models/buildingsQueueModel')
const PlanetBuilding = require('../models/planetBuildingModel')

const Research = require('../models/researchModel')
const ResearchsQueue = require('../models/researchsQueueModel')
const PlanetResearch = require('../models/planetResearchModel')

// @desc    Get planet queues
// @route   GET /api/planets/:id/queue 
// @access  Private
const getPlanetQueue = asyncHandler(async (req, res) => {
	const planet = await Planet.findById(req.params.planetId)

	if (planet.user.toString() !== req.user.id) {
	  res.status(401)
	  throw new Error('Not Authorized')
	}

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

	const researchsQueue = await ResearchsQueue.find({
		planet: new mongoose.mongo.ObjectId(req.params.planetId),
	}).sort({completed: 'asc'})

	const researchQueue = await Promise.all(researchsQueue.map(async (queueItem) => {
		let planetResearch = await PlanetResearch.findById(queueItem.research)
		let research = await Research.findById(planetResearch.research)
		return {
			queueItem,
			research,
		}
	})); 

    res.status(200).json({
		buildings: buildingQueue,
		research: researchQueue,
		fleet: [],
	})
})

module.exports = {
	getPlanetQueue,
}