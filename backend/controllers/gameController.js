const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Planet = require('../models/planetModel')

const ConstructionObject = require('../models/constructionObjectModel')
const PlanetObject = require('../models/planetObjectModel')
const ObjectQueue = require('../models/objectQueueModel')

const {
    getPlanetResourceLimits
} = require('../game')

// @desc    Get buildings queue and process it
// @access  Private
const processUpgradeQueue = asyncHandler(async (req, res) => {
    const objectQueue = await ObjectQueue.find({
		completed: {
			$lt: new Date()
		}
	})

	const processedQueue = await Promise.all(objectQueue.map(async (queueItem) => {
		const planetObject = await PlanetObject.findById(queueItem.object)
		let update

		if(queueItem.type === 'Vehicle') {
			update = {
				amount: planetObject.amount + queueItem.amount,
				active: true,
			}
		}else{
			update = {
				amount: planetObject.amount + 1,
				active: true,
			}
		}

		await planetObject.updateOne(update);

		await queueItem.remove()

		return update
	})); 
})

// @desc    Get planets and process resources
// @access  Private
const processPlanetResources = asyncHandler(async (req, res) => {
    const planets = await Planet.find()

	const processedQueue = await Promise.all(planets.map(async (planet) => {
		const oreMineId = '63e0d55ef3d73c805e4d4aaa'
		const crystalMineId = '63e0d55ef3d73c805e4d4aab'
		const gasMineId = '63e0d55ef3d73c805e4d4aac'

		const gameOreMine = await ConstructionObject.findById(oreMineId)
		const gameCrystalMine = await ConstructionObject.findById(crystalMineId)
		const gameGasMine = await ConstructionObject.findById(gasMineId)

		const planetOreMine = await PlanetObject.findOne({
			planet: new mongoose.mongo.ObjectId(planet._id),
			object: new mongoose.mongo.ObjectId(oreMineId)
		})

		const planetCrystalMine = await PlanetObject.findOne({
			planet: new mongoose.mongo.ObjectId(planet._id),
			object: new mongoose.mongo.ObjectId(crystalMineId)
		})

		const planetGasMine = await PlanetObject.findOne({
			planet: new mongoose.mongo.ObjectId(planet._id),
			object: new mongoose.mongo.ObjectId(gasMineId)
		})

        const resourceLimits = await getPlanetResourceLimits(planet._id)
	
		//work out current building levels
		const currentOreLevel = (planetOreMine) ? planetOreMine.amount : 1
		const currentCrystalLevel = (planetCrystalMine) ? planetCrystalMine.amount : 1
		const currentGasLevel = (planetGasMine) ? planetGasMine.amount : 1

		//calculate resource amount based on building level
		var newOre = planet.ore + getIntervalAmounts(gameOreMine.production * ((gameOreMine.productionMultiplier ?? 1.5) * currentOreLevel))
		var newCrystal = planet.crystal + getIntervalAmounts(gameCrystalMine.production * ((gameCrystalMine.productionMultiplier ?? 1.5) * currentCrystalLevel))
		var newGas = planet.gas + getIntervalAmounts(gameGasMine.production * ((gameGasMine.productionMultiplier ?? 1.5) * currentGasLevel))
		
		//check if resources can fit in storage
		newOre = (newOre > resourceLimits.ore) ? resourceLimits.ore : newOre
		newCrystal = (newCrystal > resourceLimits.crystal) ? resourceLimits.crystal : newCrystal
		newGas = (newGas > resourceLimits.gas) ? resourceLimits.gas : newGas

		planet.set({
			ore: newOre.toFixed(5), 
			crystal: newCrystal.toFixed(5), 
			gas: newGas.toFixed(5), 
		})

		const updatedPlanet = await planet.save();

		return {}
	})); 
})

const getIntervalAmounts = (value) => {
	//convert units / hour to units / 10 seconds
	return value / ((60 * 60) / 10) 
}

module.exports = {
    processUpgradeQueue,
	processPlanetResources
}