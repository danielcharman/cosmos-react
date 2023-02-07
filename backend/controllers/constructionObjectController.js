const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Planet = require('../models/planetModel')
 
const ConstructionObject = require('../models/constructionObjectModel')
const ObjectQueue = require('../models/objectQueueModel')
const PlanetObject = require('../models/planetObjectModel')

const {
    getObjectResourceCosts
} = require('../game')

// @desc    Get planet buildings
// @route   GET /api/planets/:id/buildings 
// @access  Private
const getPlanetBuildings = asyncHandler(async (req, res) => {
    const tempObjects = await ConstructionObject.find({
		type: 'Building'
	})

	const planet = await Planet.findById(req.params.planetId)

	if (planet.user.toString() !== req.user.id) {
	  res.status(401)
	  throw new Error('Not Authorized')
	}

	const objects = await Promise.all(tempObjects.map(async (object) => {
		let planetObject = await PlanetObject.findOne({
			planet: new mongoose.mongo.ObjectId(req.params.planetId),
			object: object._id
		})

		object.requiredObjects = await Promise.all(object.requiredObjects.map(async (requiredObject) => {
			let tempObject = await ConstructionObject.findById(requiredObject.object)

			let tempPlanetObject = await PlanetObject.findOne({
				planet: new mongoose.mongo.ObjectId(req.params.planetId),
				object: tempObject._id
			})

			requiredObject.name = tempObject.name
			requiredObject.amount = tempPlanetObject.amount

			return requiredObject
		})); 

		return {
			object,
			planetObject,
		}
	})); 

    if (!objects) {
        res.status(404)
        throw new Error('Planet buildings not found ' + req.params.planetId)
    }

    res.status(200).json(objects)
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
	const planetObject = await PlanetObject.findById(req.params.planetObjectId)

	if (!planetObject) {
		res.status(404)
		throw new Error('Planet Building not found')
	}

	//calculate costs
	const resourceCosts = await getObjectResourceCosts(planetObject.object, planetObject.amount + 1)

	if(resourceCosts.ore > planet.ore || 
		resourceCosts.crystal > planet.crystal || 
		resourceCosts.gas > planet.gas) {
		res.status(500)
		throw new Error('Planet does not have enough resources')
	}

	await planetObject.updateOne({
		active: false
	});

	//check if upgrade is already queued
	const objectQueue = await ObjectQueue.findOne({
		object: req.params.planetObjectId,
		type: 'Building',
	}).sort({
		completed: 'desc'
	})

	let completedDate = new Date();
	if (objectQueue) {
		completedDate = new Date(objectQueue.completed)
	}

	//add upgrade to queue
	completedDate.setSeconds(completedDate.getSeconds() + resourceCosts.duration);

	const queuedItem = await ObjectQueue.create({
		planet: req.params.planetId,
		object: req.params.planetObjectId,
		type: 'Building',
		action: 'Upgrade',
		completed: completedDate,
		amount: planetObject.amount + 1,
	})

	//charge planet with upgrade costs 
	const updatedPlanet = await Planet.findByIdAndUpdate(
		req.params.planetId,
		{
			ore: planet.ore - resourceCosts.ore,
			crystal: planet.crystal - resourceCosts.crystal,
			gas: planet.gas - resourceCosts.gas,
		}
	)

	res.status(200).json(queuedItem)
})

// @desc    Create new building
// @route   POST /api/building
// @access  Private
const createBuilding = asyncHandler(async (req, res) => {
    const { name, type, description } = req.body

    if (!name || !type || !description) {
        res.status(400)
        throw new Error('Please add a name, type and description')
    }

    const constructionObject = await ConstructionObject.create({
        name,
        type,
        description,
    })

    res.status(201).json(constructionObject)
})

// @desc    Get planet technologies
// @route   GET /api/planets/:id/technologies 
// @access  Private
const getPlanetTechnologies = asyncHandler(async (req, res) => {
	const tempObjects = await ConstructionObject.find({
		type: 'Technology'
	})

	const planet = await Planet.findById(req.params.planetId)

	if (planet.user.toString() !== req.user.id) {
	  res.status(401)
	  throw new Error('Not Authorized')
	}

	const objects = await Promise.all(tempObjects.map(async (object) => {
		let planetObject = await PlanetObject.findOne({
			planet: new mongoose.mongo.ObjectId(req.params.planetId),
			object: object._id
		})

		object.requiredObjects = await Promise.all(object.requiredObjects.map(async (requiredObject) => {
			let tempObject = await ConstructionObject.findById(requiredObject.object)

			let tempPlanetObject = await PlanetObject.findOne({
				planet: new mongoose.mongo.ObjectId(req.params.planetId),
				object: tempObject._id
			})

			requiredObject.name = tempObject.name
			requiredObject.amount = tempPlanetObject.amount
			
			return requiredObject
		})); 

		return {
			object,
			planetObject,
		}
	})); 

    if (!objects) {
        res.status(404)
        throw new Error('Planet technologies not found ' + req.params.planetId)
    }

    res.status(200).json(objects)
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
	const planetObject = await PlanetObject.findById(req.params.planetObjectId)

	if (!planetObject) {
		res.status(404)
		throw new Error('Planet Technology not found')
	}

	//calculate costs
	const resourceCosts = await getObjectResourceCosts(planetObject.object, planetObject.amount + 1)

	if(resourceCosts.ore > planet.ore || 
		resourceCosts.crystal > planet.crystal || 
		resourceCosts.gas > planet.gas) {
		res.status(500)
		throw new Error('Planet does not have enough resources')
	}

	await planetObject.updateOne({
		active: false
	});

	//check if upgrade is already queued
	const objectQueue = await ObjectQueue.findOne({
		object: req.params.planetObjectId,
		type: 'Technology',
	}).sort({
		completed: 'desc'
	})

	let completedDate = new Date();
	if (objectQueue) {
		completedDate = new Date(objectQueue.completed)
	}

	//add upgrade to queue
	completedDate.setSeconds(completedDate.getSeconds() + resourceCosts.duration);

	const queuedItem = await ObjectQueue.create({
		planet: req.params.planetId,
		object: req.params.planetObjectId,
		type: 'Technology',
		action: 'Upgrade',
		completed: completedDate,
		amount: planetObject.amount + 1,
	})

	//charge planet with upgrade costs 
	const updatedPlanet = await Planet.findByIdAndUpdate(
		req.params.planetId,
		{
			ore: planet.ore - resourceCosts.ore,
			crystal: planet.crystal - resourceCosts.crystal,
			gas: planet.gas - resourceCosts.gas,
		}
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

    const constructionObject = await ConstructionObject.create({
        name,
        type,
        description,
    })

    res.status(201).json(constructionObject)
})

// @desc    Get planet vehicles
// @route   GET /api/planets/:id/vehicle 
// @access  Private
const getPlanetVehicles = asyncHandler(async (req, res) => {
    const tempObjects = await ConstructionObject.find({
		type: 'Vehicle'
	})

	const planet = await Planet.findById(req.params.planetId)

	if (planet.user.toString() !== req.user.id) {
	  res.status(401)
	  throw new Error('Not Authorized')
	}

	const objects = await Promise.all(tempObjects.map(async (object) => {
		let planetObject = await PlanetObject.findOne({
			planet: new mongoose.mongo.ObjectId(req.params.planetId),
			object: object._id
		})

		object.requiredObjects = await Promise.all(object.requiredObjects.map(async (requiredObject) => {
			let tempObject = await ConstructionObject.findById(requiredObject.object)

			let tempPlanetObject = await PlanetObject.findOne({
				planet: new mongoose.mongo.ObjectId(req.params.planetId),
				object: tempObject._id
			})

			requiredObject.name = tempObject.name
			requiredObject.amount = tempPlanetObject.amount
			
			return requiredObject
		})); 

		return {
			object,
			planetObject,
		}
	})); 

    if (!objects) {
        res.status(404)
        throw new Error('Planet vehicles not found ' + req.params.planetId)
    }

    res.status(200).json(objects)
})

// @desc    Update vehicle
// @route   PUT /api/planets/:id/vehicle/:id
// @access  Private
const updatePlanetVehicle = asyncHandler(async (req, res) => {
	const planet = await Planet.findById(req.params.planetId)

	if (planet.user.toString() !== req.user.id) {
	  res.status(401)
	  throw new Error('Not Authorized')
	}
	
	//check planet vehicle exists
	const planetObject = await PlanetObject.findById(req.params.planetObjectId)

	if (!planetObject) {
		res.status(404)
		throw new Error('Planet Vehicle not found')
	}

	//calculate costs
	const resourceCosts = await getObjectResourceCosts(planetObject.object, req.body.amount, false)

	if(resourceCosts.ore > planet.ore || 
		resourceCosts.crystal > planet.crystal || 
		resourceCosts.gas > planet.gas) {
		res.status(500)
		throw new Error('Planet does not have enough resources')
	}

	await planetObject.updateOne({
		active: false
	});

	//check if upgrade is already queued
	const objectQueue = await ObjectQueue.findOne({
		object: req.params.planetObjectId,
		type: 'Vehicle',
	}).sort({
		completed: 'desc'
	})

	let completedDate = new Date();
	if (objectQueue) {
		completedDate = new Date(objectQueue.completed)
	}

	//add upgrade to queue
	completedDate.setSeconds(completedDate.getSeconds() + resourceCosts.duration);

	const queuedItem = await ObjectQueue.create({
		planet: req.params.planetId,
		object: req.params.planetObjectId,
		type: 'Vehicle',
		action: 'Build',
		completed: completedDate,
		amount: req.body.amount,
	})

	//charge planet with upgrade costs 
	const updatedPlanet = await Planet.findByIdAndUpdate(
		req.params.planetId,
		{
			ore: planet.ore - resourceCosts.ore,
			crystal: planet.crystal - resourceCosts.crystal,
			gas: planet.gas - resourceCosts.gas,
		}
	)

	res.status(200).json(queuedItem)
})

// @desc    Create new vehicle
// @route   POST /api/vehicle
// @access  Private
const createVehicle = asyncHandler(async (req, res) => {
    const { name, type, description } = req.body

    if (!name || !type || !description) {
        res.status(400)
        throw new Error('Please add a name, type and description')
    }

    const constructionObject = await ConstructionObject.create({
        name,
        type,
        description,
    })

    res.status(201).json(constructionObject)
})

module.exports = {
    getPlanetBuildings,
    updatePlanetBuilding,
	getPlanetTechnologies,
    updatePlanetTechnology,
	createTechnology,
	getPlanetVehicles,
    updatePlanetVehicle,
	createVehicle
}