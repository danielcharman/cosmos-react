const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Planet = require('../models/planetModel')

const Building = require('../models/buildingModel')
const BuildingsQueue = require('../models/buildingsQueueModel')
const PlanetBuilding = require('../models/planetBuildingModel')

const Technology = require('../models/technologyModel')
const TechnologiesQueue = require('../models/technologiesQueueModel')
const PlanetTechnology = require('../models/planetTechnologyModel')

const {
    getPlanetResourceLimits
} = require('../game')

// @desc    Get buildings queue and process it
// @access  Private
const processUpgradeQueue = asyncHandler(async (req, res) => {
    const buildingsQueue = await BuildingsQueue.find({
		completed: {
			$lt: new Date()
		}
	})

	const processedBuildingsQueue = await Promise.all(buildingsQueue.map(async (queueItem) => {
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

	const technologiesQueue = await TechnologiesQueue.find({
		completed: {
			$lt: new Date()
		}
	})

	const processedTechnologiesQueue = await Promise.all(technologiesQueue.map(async (queueItem) => {
		//do stuff and then remove queue item
		const updatedTechnology = await PlanetTechnology.findByIdAndUpdate(
			queueItem.technology,
			{
				level: queueItem.level,
				active: true,
			},
			{ new: true }
		)

		await queueItem.remove()

		return updatedTechnology
	})); 
})

// @desc    Get planets and process resources
// @access  Private
const processPlanetResources = asyncHandler(async (req, res) => {
    const planets = await Planet.find()

	const processedQueue = await Promise.all(planets.map(async (planet) => {
		const gameOreMine = await Building.findById('63d7afdf48791a8ebd439f3b')
		const gameCrystalMine = await Building.findById('63d7aff848791a8ebd439f3e')
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

        const resourceLimits = await getPlanetResourceLimits(planet._id)
	
		//work out current building levels
		const currentOreLevel = (planetOreMine) ? planetOreMine.level : 1
		const currentCrystalLevel = (planetCrystalMine) ? planetCrystalMine.level : 1
		const currentGasLevel = (planetGasMine) ? planetGasMine.level : 1

		//calculate resource amount based on building level
		var newOre = (gameOreMine.production * ((gameOreMine.productionMultiplier ?? 1.5) * currentOreLevel))
		var newCrystal = (gameCrystalMine.production * ((gameCrystalMine.productionMultiplier ?? 1.5) * currentCrystalLevel))
		var newGas = (gameGasMine.production * ((gameGasMine.productionMultiplier ?? 1.5) * currentGasLevel))

		//check if resources can fit in storage
		newOre = (newOre > resourceLimits.ore) ? resourceLimits.ore : newOre
		newCrystal = (newCrystal > resourceLimits.crystal) ? resourceLimits.crystal : newCrystal
		newGas = (newGas > resourceLimits.gas) ? resourceLimits.gas : newGas

		const getIntervalAmounts = (value) => {
			//convert units / hour to units / 10 seconds
			return value / ((60 * 60) / 10) 
		}

		planet.set({
			ore: (planet.ore + getIntervalAmounts(newOre)).toFixed(5), 
			crystal: (planet.crystal + getIntervalAmounts(newCrystal)).toFixed(5), 
			gas: (planet.gas + getIntervalAmounts(newGas)).toFixed(5), 
		})

		const updatedPlanet = await planet.save();

		return {}
	})); 
})

module.exports = {
    processUpgradeQueue,
	processPlanetResources
}