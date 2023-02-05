const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Planet = require('../models/planetModel')
 
const Building = require('../models/buildingModel')
const BuildingsQueue = require('../models/buildingsQueueModel')
const PlanetBuilding = require('../models/planetBuildingModel')

// @desc    Get planet buildings
// @route   GET /api/planets/:id/buildings 
// @access  Private
const getPlanetBuildings = asyncHandler(async (req, res) => {
    const tempBuildings = await Building.find()

	const planet = await Planet.findById(req.params.planetId)

	if (planet.user.toString() !== req.user.id) {
	  res.status(401)
	  throw new Error('Not Authorized')
	}

	const buildings = await Promise.all(tempBuildings.map(async (building) => {
		let planetBuilding = await PlanetBuilding.findOne({
			planet: req.params.planetId,
			building: building._id
		})

		return {
			building,
			planetBuilding,
		}
	})); 

    if (!buildings) {
        res.status(404)
        throw new Error('Planet buildings not found ' + req.params.planetId)
    }

    res.status(200).json(buildings)
})

// @desc    Update building
// @route   PUT /api/planets/:id/buildings/:id
// @access  Private
const updatePlanetBuilding = asyncHandler(async (req, res) => {
	const planet = await Planet.findById(req.params.planetId)

	if (planet.user.toString() !== req.user.id) {
	  res.status(401)
	  throw new Error('Not Authorized')
	}
	
	//check planet building exists
	const planetBuilding = await PlanetBuilding.findById(req.params.planetBuildingId)

	if (!planetBuilding) {
		res.status(404)
		throw new Error('Planet Building not found')
	}

	//get planet and building details to calculate costs
	const building = await Building.findById(planetBuilding.building)

	const {
		duration, 
		durationMultipler,
		ore, 
		oreMultipler,
		crystal,
		crystalMultipler,
		gas,
		gasMultipler
	} = building

	const durationSeconds = duration * (durationMultipler * req.body.level)
	const oreCost = ore * (oreMultipler * req.body.level)
	const crystalCost = crystal * (crystalMultipler * req.body.level)
	const gasCost = gas * (gasMultipler * req.body.level)

	if(oreCost > planet.ore) {
		res.status(500)
		throw new Error('Planet does not have enough ore')
	}

	if(crystalCost > planet.crystal) {
		res.status(500)
		throw new Error('Planet does not have enough crystal')
	}

	if(gasCost > planet.gas) {
		res.status(500)
		throw new Error('Planet does not have enough gas')
	}

	const updatedBuilding = await PlanetBuilding.findByIdAndUpdate(
		req.params.planetBuildingId,
		{
			active: false
		},
		{ new: true }
	)

	//check if upgrade is already queued
	const buildingQueue = await BuildingsQueue.findOne({building: req.params.planetBuildingId}).sort({completed: 'desc'})

	let completedDate = new Date();
	if (buildingQueue) {
		completedDate = new Date(buildingQueue.completed)
	}

	//add upgrade to queue
	completedDate.setSeconds(completedDate.getSeconds() + durationSeconds);

	const queuedItem = await BuildingsQueue.create({
		planet: req.params.planetId,
		building: req.params.planetBuildingId,
		completed: completedDate,
		level: req.body.level,
	})

	//charge planet with upgrade costs 
	const updatedPlanet = await Planet.findByIdAndUpdate(
		req.params.planetId,
		{
			ore: planet.ore - oreCost,
			crystal: planet.crystal - crystalCost,
			gas: planet.gas - gasCost,
		},
		{ new: true }
	)

	res.status(200).json(queuedItem)
})

module.exports = {
    getPlanetBuildings,
    updatePlanetBuilding,
}