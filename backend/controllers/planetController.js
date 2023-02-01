const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const User = require('../models/userModel')
const Planet = require('../models/planetModel')
const Building = require('../models/buildingModel')
const PlanetBuilding = require('../models/planetBuildingModel')

// @desc    Get planets
// @route   GET /api/planets
// @access  Private
const getAllPlanets = asyncHandler(async (req, res) => {
    const planets = await Planet.find().exec()

    res.status(200).json(planets)
})

// @desc    Get users planets
// @route   GET /api/users/:id/planets
// @access  Private
const getUserPlanets = asyncHandler(async (req, res) => {
    const planets = await Planet.find({ user: req.user.id })

    res.status(200).json(planets)
})

// @desc    Get user planet
// @route   GET /api/planets/:id
// @access  Private
const getPlanet = asyncHandler(async (req, res) => {
    const planet = await Planet.findById(req.params.id)

    if (!planet) {
        res.status(404)
        throw new Error('Planet not found')
    }

    // if (planet.user.toString() !== req.user.id) {
    //     res.status(401)
    //     throw new Error('Not Authorized')
    // }

    res.status(200).json(planet)
})

// @desc    Create new planet
// @route   POST /api/planets
// @access  Private
const createPlanet = asyncHandler(async (req, res) => {
    const { position, name, temperature, size } = req.body

    if (!position) {
		res.status(400)
		throw new Error('Please add a position')
	}
  
    if (!name) {
		res.status(400)
		throw new Error('Please add a name')
	} 

	if (!temperature) {
	  res.status(400)
	  throw new Error('Please add a temperature')
	}

	if (!size) {
		res.status(400)
		throw new Error('Please add a size')
	}

    const planet = await Planet.create({
        position,
        name,
        temperature,
        size,
        user: req.user.id,
        // status: 'new',
    })

    res.status(201).json(planet)
})

// @desc    Update planet
// @route   PUT /api/planets/:id
// @access  Private
const updatePlanet = asyncHandler(async (req, res) => {
	const planet = await Planet.findById(req.params.id)

	if (!planet) {
		res.status(404)
		throw new Error('Planet not found')
	}

	if (planet.user.toString() !== req.user.id) {
		res.status(401)
		throw new Error('Not Authorized')
	}

	const updatedPlanet = await Planet.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	)

	res.status(200).json(updatedPlanet)
})

// @desc    Delete planet
// @route   DELETE /api/planets/:id
// @access  Private
const deletePlanet = asyncHandler(async (req, res) => {
	const planet = await Planet.findById(req.params.id)

	if (!planet) {
		res.status(404)
		throw new Error('Planet not found')
	}

	if (planet.user.toString() !== req.user.id) {
		res.status(401)
		throw new Error('Not Authorized')
	}

	await planet.remove()

	res.status(200).json({ success: true })
})

// @desc    Get user planet
// @route   GET /api/planets/:id/buildings
// @access  Public
const getPlanetBuildings = asyncHandler(async (req, res) => {
	const planetBuildings = await PlanetBuilding.find({
		planet: new mongoose.mongo.ObjectId(req.params.id)
	})

	if (!planetBuildings) {
		res.status(404)
		throw new Error('Planet buildings not found')
	}

	res.status(200).json(planetBuildings)
})

// @desc    Get buildings queue and process it
// @access  Private
const processPlanetResources = asyncHandler(async (req, res) => {
    const planets = await Planet.find()

	const processedQueue = await Promise.all(planets.map(async (planet) => {	
		const gameOreMine = await Building.findById('63d7afdf48791a8ebd439f3b')

		const planetOreMine = await PlanetBuilding.findOne({
			planet: new mongoose.mongo.ObjectId(planet._id),
			building: new mongoose.mongo.ObjectId('63d7afdf48791a8ebd439f3b')
		})

		console.log(gameOreMine)

		const newOre = (gameOreMine.production * ((gameOreMine.productionMultiplier ?? 1.5) * planetOreMine.level))
		const newCrystal = 20 * 3.5
		const newGas = 10 & 4.3

		planet.set({
			ore: (planet.ore + newOre).toFixed(0),
			crystal: (planet.crystal + newCrystal).toFixed(0),
			gas: (planet.gas + newGas).toFixed(0), 
		})		

		const updatedPlanet = await planet.save();
		// console.log('updatedPlanet', updatedPlanet)

		// //do stuff and then remove queue item
		// const updatedBuilding = await PlanetBuilding.findByIdAndUpdate(
		// 	queueItem.building,
		// 	{
		// 		level: queueItem.level,
		// 		active: true,
		// 	},
		// 	{ new: true }
		// )

		// console.log(updatedBuilding)

		// await queueItem.remove()

		return {}
	})); 
})

module.exports = {
    getAllPlanets,
	getUserPlanets,
    getPlanet,
    createPlanet,
    updatePlanet,
    deletePlanet,
    getPlanetBuildings,
	processPlanetResources
}