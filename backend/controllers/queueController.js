const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Planet = require('../models/planetModel')

const Building = require('../models/buildingModel')
const BuildingsQueue = require('../models/buildingsQueueModel')
const PlanetBuilding = require('../models/planetBuildingModel')

const Technology = require('../models/technologyModel')
const TechnologiesQueue = require('../models/technologiesQueueModel')
const PlanetTechnology = require('../models/planetTechnologyModel')

const Vehicle = require('../models/vehicleModel')
const VehiclesQueue = require('../models/vehiclesQueueModel')
const PlanetVehicle = require('../models/planetVehicleModel')

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

	const technologiesQueue = await TechnologiesQueue.find({
		planet: new mongoose.mongo.ObjectId(req.params.planetId),
	}).sort({completed: 'asc'})

	const technologyQueue = await Promise.all(technologiesQueue.map(async (queueItem) => {
		let planetTechnology = await PlanetTechnology.findById(queueItem.technology)
		let technology = await Technology.findById(planetTechnology.technology)
		return {
			queueItem,
			technology,
		}
	})); 

	const vehiclesQueue = await VehiclesQueue.find({
		planet: new mongoose.mongo.ObjectId(req.params.planetId),
	}).sort({completed: 'asc'})

	const vehicleQueue = await Promise.all(vehiclesQueue.map(async (queueItem) => {
		let planetVehicle = await PlanetVehicle.findById(queueItem.vehicle)
		let vehicle = await Vehicle.findById(planetVehicle.vehicle)
		return {
			queueItem,
			vehicle,
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