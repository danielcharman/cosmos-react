const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Building = require('../models/buildingModel')
const BuildingsQueue = require('../models/buildingsQueueModel')
const Planet = require('../models/planetModel')
const PlanetBuilding = require('../models/planetBuildingModel')

// @desc    Get buildings queue and process it
// @access  Private
const processBuildingQueue = asyncHandler(async (req, res) => {
    const buildingsQueue = await BuildingsQueue.find({
		completed: {
			$lt: new Date()
		}
	})

	const processedQueue = await Promise.all(buildingsQueue.map(async (queueItem) => {
		//do stuff and then remove queue item
		const updatedBuilding = await PlanetBuilding.findByIdAndUpdate(
			queueItem.building,
			{
				level: queueItem.level,
				active: true,
			},
			{ new: true }
		)

		await queueItem.remove()

		return updatedBuilding
	})); 
})

// @desc    Get planets and process resources
// @access  Private
const processPlanetResources = asyncHandler(async (req, res) => {
    const planets = await Planet.find()

	const processedQueue = await Promise.all(planets.map(async (planet) => {	
		const gameOreMine = await Building.findById('63d7afdf48791a8ebd439f3b')
		const gamCrystalMine = await Building.findById('63d7aff848791a8ebd439f3e')
		const gameGasMine = await Building.findById('63d7b01448791a8ebd439f41')

		const planetOreMine = await PlanetBuilding.findOne({
			planet: new mongoose.mongo.ObjectId(planet._id),
			building: new mongoose.mongo.ObjectId('63d7afdf48791a8ebd439f3b')
		})

		const planetCrystalMine = await PlanetBuilding.findOne({
			planet: new mongoose.mongo.ObjectId(planet._id),
			building: new mongoose.mongo.ObjectId('63d7aff848791a8ebd439f3e')
		})

		const planetGasMine = await PlanetBuilding.findOne({
			planet: new mongoose.mongo.ObjectId(planet._id),
			building: new mongoose.mongo.ObjectId('63d7b01448791a8ebd439f41')
		})

		const currentOreLevel = (planetOreMine) ? planetOreMine.level : 1
		const currentCrystalLevel = (planetCrystalMine) ? planetCrystalMine.level : 1
		const currentGasLevel = (planetGasMine) ? planetGasMine.level : 1

		const newOre = (gameOreMine.production * ((gameOreMine.productionMultiplier ?? 1.5) * currentOreLevel))
		const newCrystal = (gamCrystalMine.production * ((gamCrystalMine.productionMultiplier ?? 1.5) * currentCrystalLevel))
		const newGas = (gameGasMine.production * ((gameGasMine.productionMultiplier ?? 1.5) * currentGasLevel))

		planet.set({
			ore: (planet.ore + newOre).toFixed(0), 
			crystal: (planet.crystal + newCrystal).toFixed(0), 
			gas: (planet.gas + newGas).toFixed(0), 
		})		

		const updatedPlanet = await planet.save();

		return {}
	})); 
})

module.exports = {
    processBuildingQueue,
	processPlanetResources
}