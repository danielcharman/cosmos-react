const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Planet = require('../models/planetModel')

const ConstructionObject = require('../models/constructionObjectModel')
const PlanetObject = require('../models/planetObjectModel')
const ObjectQueue = require('../models/objectQueueModel')

// @desc    Get planet queues
// @route   GET /api/planets/:id/queue 
// @access  Private
const getPlanetQueue = asyncHandler(async (req, res) => {
	const planet = await Planet.findById(req.params.planetId)

	if (planet.user.toString() !== req.user.id) {
	  res.status(401)
	  throw new Error('Not Authorized')
	}

    const buildingsQueue = await ObjectQueue.find({
		planet: new mongoose.mongo.ObjectId(req.params.planetId),
		type: 'Building',
	}).sort({
		completed: 'asc'
	})

	const buildingQueue = await Promise.all(buildingsQueue.map(async (queueItem) => {
		let planetObject = await PlanetObject.findById(queueItem.object)
		let object = await ConstructionObject.findById(planetObject.object)
		return {
			queueItem,
			object,
		}
	})); 

	const technologiesQueue = await ObjectQueue.find({
		planet: new mongoose.mongo.ObjectId(req.params.planetId),
		type: 'Technology',
	}).sort({
		completed: 'asc'
	})

	const technologyQueue = await Promise.all(technologiesQueue.map(async (queueItem) => {
		let planetObject = await PlanetObject.findById(queueItem.object)
		let object = await ConstructionObject.findById(planetObject.object)
		return {
			queueItem,
			object,
		}
	})); 

	const vehiclesQueue = await ObjectQueue.find({
		planet: new mongoose.mongo.ObjectId(req.params.planetId),
		type: 'Vehicle',
	}).sort({
		completed: 'asc'
	})

	const vehicleQueue = await Promise.all(vehiclesQueue.map(async (queueItem) => {
		let planetObject = await PlanetObject.findById(queueItem.object)
		let object = await ConstructionObject.findById(planetObject.object)
		return {
			queueItem,
			object,
		}
	})); 

    res.status(200).json({
		buildings: buildingQueue,
		technologies: technologyQueue,
		vehicles: vehicleQueue,
	})
})

module.exports = {
	getPlanetQueue,
}