const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Planet = require('../models/planetModel')

const Research = require('../models/researchModel')
const ResearchsQueue = require('../models/researchsQueueModel')
const PlanetResearch = require('../models/planetResearchModel')

// @desc    Get planet researchs
// @route   GET /api/planets/:id/research 
// @access  Private
const getPlanetResearchs = asyncHandler(async (req, res) => {
    const tempResearchs = await Research.find()

	const planet = await Planet.findById(req.params.planetId)

	if (planet.user.toString() !== req.user.id) {
	  res.status(401)
	  throw new Error('Not Authorized')
	}

	const researchs = await Promise.all(tempResearchs.map(async (research) => {
		let planetResearch = await PlanetResearch.findOne({
			planet: req.params.planetId,
			research: research._id
		})

		return {
			research,
			planetResearch,
		}
	})); 

    if (!researchs) {
        res.status(404)
        throw new Error('Planet researchs not found ' + req.params.planetId)
    }

    res.status(200).json(researchs)
})

// @desc    Update research
// @route   PUT /api/planets/:id/research/:id
// @access  Private
const updatePlanetResearch = asyncHandler(async (req, res) => {
	const planet = await Planet.findById(req.params.planetId)

	if (planet.user.toString() !== req.user.id) {
	  res.status(401)
	  throw new Error('Not Authorized')
	}
	
	//check planet research exists
	const planetResearch = await PlanetResearch.findById(req.params.planetResearchId)

	if (!planetResearch) {
		res.status(404)
		throw new Error('Planet Research not found')
	}

	//get planet and research details to calculate costs
	const research = await Research.findById(planetResearch.research)

	const {
		duration, 
		durationMultipler,
		ore, 
		oreMultipler,
		crystal,
		crystalMultipler,
		gas,
		gasMultipler
	} = research

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

	const updatedResearch = await PlanetResearch.findByIdAndUpdate(
		req.params.planetResearchId,
		{
			active: false
		},
		{ new: true }
	)

	//check if upgrade is already queued
	const researchQueue = await ResearchsQueue.findOne({research: req.params.planetResearchId}).sort({completed: 'desc'})

	let completedDate = new Date();
	if (researchQueue) {
		completedDate = new Date(researchQueue.completed)
	}

	//add upgrade to queue
	completedDate.setSeconds(completedDate.getSeconds() + durationSeconds);

	const queuedItem = await ResearchsQueue.create({
		planet: req.params.planetId,
		research: req.params.planetResearchId,
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
    getPlanetResearchs,
    updatePlanetResearch, 
}