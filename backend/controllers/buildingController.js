const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Building = require('../models/buildingModel')
const BuildingsQueue = require('../models/buildingsQueueModel')
const Planet = require('../models/planetModel')
const PlanetBuilding = require('../models/planetBuildingModel')

// @desc    Get buildings
// @route   GET /api/buildings
// @access  Private
const getAllBuildings = asyncHandler(async (req, res) => {
    const buildings = await Building.find()

    res.status(200).json(buildings)
})

// @desc    Get planet buildings
// @route   GET /api/planets/:id/buildings 
// @access  Private
const getPlanetBuildings = asyncHandler(async (req, res) => {
    const tempBuildings = await Building.find()

	const buildings = await Promise.all(tempBuildings.map(async (building) => {
		let planetBuilding = await PlanetBuilding.findOne({
			planet: req.params.planetId,
			building: building._id
		})

		if(!planetBuilding) {
			planetBuilding = await PlanetBuilding.create({
				planet: req.params.planetId,
				building: building._id,
				level: 1,
			})
		}

		return {
			building,
			planetBuilding,
		}
	})); 

	// const planetBuildings = await PlanetBuilding.find({planet: req.params.planetId})

	// const buildings = await Promise.all(planetBuildings.map(async (planetBuilding) => {
	// 	const building = await Building.findById(planetBuilding.building)
	// 	planetBuilding.building = building
	// 	return planetBuilding
	// })); 

    if (!buildings) {
        res.status(404)
        throw new Error('Planet buildings not found ' + req.params.planetId)
    }

    // if (planet.user.toString() !== req.user.id) {
    //     res.status(401)
    //     throw new Error('Not Authorized')
    // }

    res.status(200).json(buildings)
})

// @desc    Get planet building
// @route   GET /api/planets/:id
// @access  Private
const getBuilding = asyncHandler(async (req, res) => {
    const building = await Building.findById(req.params.id)

    if (!building) {
        res.status(404)
        throw new Error('Building not found')
    }

    if (building.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    res.status(200).json(building)
})

// @desc    Create new building
// @route   POST /api/buildings
// @access  Private
const createBuilding = asyncHandler(async (req, res) => {
    const { name, type, description } = req.body

    if (!name) {
		res.status(400)
		throw new Error('Please add a name')
	} 

	if (!type) {
	  res.status(400)
	  throw new Error('Please select a type')
	}

	if (!description) {
		res.status(400)
		throw new Error('Please add a description')
	}

    const building = await Building.create({
        name,
        type,
        description,
        // user: req.user.id,
        // status: 'new',
    })

    res.status(201).json(building)
})

// @desc    Update building
// @route   PUT /api/buildings/:id
// @access  Private
const updateBuilding = asyncHandler(async (req, res) => {
	const building = await Building.findById(req.params.id)

	if (!building) {
		res.status(404)
		throw new Error('Building not found')
	}

	if (building.user.toString() !== req.user.id) {
		res.status(401)
		throw new Error('Not Authorized')
	}

	const updatedBuilding = await Building.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	)

	res.status(200).json(updatedBuilding)
})

// @desc    Update building
// @route   PUT /api/buildings/:id
// @access  Private
const updatePlanetBuilding = asyncHandler(async (req, res) => {
	//check planet building exists
	const planetBuilding = await PlanetBuilding.findById(req.params.planetBuildingId)

	if (!planetBuilding) {
		res.status(404)
		throw new Error('Planet Building not found')
	}

	//check if upgrade is already queued
	const buildingQueue = await BuildingsQueue.findOne({building: req.params.planetBuildingId})

	if (buildingQueue) {
		res.status(500)
		throw new Error('Building already in upgrade queue')
	}

	//get planet and building details to calculate costs
	const building = await Building.findById(planetBuilding.building)
	const planet = await Planet.findById(req.params.planetId)

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

	// if (building.user.toString() !== req.user.id) {
	//   res.status(401)
	//   throw new Error('Not Authorized')
	// }

	const updatedBuilding = await PlanetBuilding.findByIdAndUpdate(
		req.params.planetBuildingId,
		{
			active: false
		},
		{ new: true }
	)

	//add upgrade to queue
	var completedDate = new Date();
	completedDate.setSeconds(completedDate.getSeconds() + durationSeconds);

	const queuedItem = await BuildingsQueue.create({
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

// @desc    Delete building
// @route   DELETE /api/buildings/:id
// @access  Private
const deleteBuilding = asyncHandler(async (req, res) => {
  const building = await Building.findById(req.params.id)

  if (!building) {
    res.status(404)
    throw new Error('Building not found')
  }

  if (building.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  await building.remove()

  res.status(200).json({ success: true })
})

module.exports = {
    getAllBuildings,
    getPlanetBuildings,
    getBuilding,
    createBuilding,
    updateBuilding,
    updatePlanetBuilding,
    deleteBuilding
}