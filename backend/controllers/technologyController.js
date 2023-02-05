const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Planet = require('../models/planetModel')

const Technology = require('../models/technologyModel')
const TechnologiesQueue = require('../models/technologiesQueueModel')
const PlanetTechnology = require('../models/planetTechnologyModel')

// @desc    Get planet technologies
// @route   GET /api/planets/:id/technology 
// @access  Private
const getPlanetTechnologies = asyncHandler(async (req, res) => {
    const tempTechnologies = await Technology.find()

	const planet = await Planet.findById(req.params.planetId)

	if (planet.user.toString() !== req.user.id) {
	  res.status(401)
	  throw new Error('Not Authorized')
	}

	const technologies = await Promise.all(tempTechnologies.map(async (technology) => {
		let planetTechnology = await PlanetTechnology.findOne({
			planet: req.params.planetId,
			technology: technology._id
		})

		return {
			technology,
			planetTechnology,
		}
	})); 

    if (!technologies) {
        res.status(404)
        throw new Error('Planet technologies not found ' + req.params.planetId)
    }

    res.status(200).json(technologies)
})

// @desc    Update technology
// @route   PUT /api/planets/:id/technology/:id
// @access  Private
const updatePlanetTechnology = asyncHandler(async (req, res) => {
	const planet = await Planet.findById(req.params.planetId)

	if (planet.user.toString() !== req.user.id) {
	  res.status(401)
	  throw new Error('Not Authorized')
	}
	
	//check planet technology exists
	const planetTechnology = await PlanetTechnology.findById(req.params.planetTechnologyId)

	if (!planetTechnology) {
		res.status(404)
		throw new Error('Planet Technology not found')
	}

	//get planet and technology details to calculate costs
	const technology = await Technology.findById(planetTechnology.technology)

	const {
		duration, 
		durationMultipler,
		ore, 
		oreMultipler,
		crystal,
		crystalMultipler,
		gas,
		gasMultipler
	} = technology

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

	const updatedTechnology = await PlanetTechnology.findByIdAndUpdate(
		req.params.planetTechnologyId,
		{
			active: false
		},
		{ new: true }
	)

	//check if upgrade is already queued
	const technologyQueue = await TechnologiesQueue.findOne({technology: req.params.planetTechnologyId}).sort({completed: 'desc'})

	let completedDate = new Date();
	if (technologyQueue) {
		completedDate = new Date(technologyQueue.completed)
	}

	//add upgrade to queue
	completedDate.setSeconds(completedDate.getSeconds() + durationSeconds);

	const queuedItem = await TechnologiesQueue.create({
		planet: req.params.planetId,
		technology: req.params.planetTechnologyId,
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

// @desc    Create new technology
// @route   POST /api/technology
// @access  Private
const createTechnology = asyncHandler(async (req, res) => {
    const { name, type, description } = req.body

    if (!name || !type || !description) {
        res.status(400)
        throw new Error('Please add a name, type and description')
    }

    const technology = await Technology.create({
        name,
        type,
        description,
    })

    res.status(201).json(technology)
})

module.exports = {
    getPlanetTechnologies,
    updatePlanetTechnology,
	createTechnology,
}