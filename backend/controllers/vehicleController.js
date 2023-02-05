const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Planet = require('../models/planetModel')

const Vehicle = require('../models/vehicleModel')
const VehiclesQueue = require('../models/vehiclesQueueModel')
const PlanetVehicle = require('../models/planetVehicleModel')

// @desc    Get planet vehicles
// @route   GET /api/planets/:id/vehicle 
// @access  Private
const getPlanetVehicles = asyncHandler(async (req, res) => {
    const tempVehicles = await Vehicle.find()

	const planet = await Planet.findById(req.params.planetId)

	if (planet.user.toString() !== req.user.id) {
	  res.status(401)
	  throw new Error('Not Authorized')
	}

	const vehicles = await Promise.all(tempVehicles.map(async (vehicle) => {
		let planetVehicle = await PlanetVehicle.findOne({
			planet: req.params.planetId,
			vehicle: vehicle._id
		})

		return {
			vehicle,
			planetVehicle,
		}
	})); 

    if (!vehicles) {
        res.status(404)
        throw new Error('Planet vehicles not found ' + req.params.planetId)
    }

    res.status(200).json(vehicles)
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
	const planetVehicle = await PlanetVehicle.findById(req.params.planetVehicleId)

	if (!planetVehicle) {
		res.status(404)
		throw new Error('Planet Vehicle not found')
	}

	//get planet and vehicle details to calculate costs
	const vehicle = await Vehicle.findById(planetVehicle.vehicle)

	const {
		duration, 
		ore, 
		crystal,
		gas,
	} = vehicle

	const durationSeconds = duration * req.body.quantity
	const oreCost = ore * req.body.quantity
	const crystalCost = crystal * req.body.quantity
	const gasCost = gas * req.body.quantity

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

	const updatedVehicle = await PlanetVehicle.findByIdAndUpdate(
		req.params.planetVehicleId,
		{
			active: false
		},
		{ new: true }
	)

	//check if upgrade is already queued
	const vehicleQueue = await VehiclesQueue.findOne({vehicle: req.params.planetVehicleId}).sort({completed: 'desc'})

	let completedDate = new Date();
	if (vehicleQueue) {
		completedDate = new Date(vehicleQueue.completed)
	}

	//add upgrade to queue
	completedDate.setSeconds(completedDate.getSeconds() + durationSeconds);

	const queuedItem = await VehiclesQueue.create({
		planet: req.params.planetId,
		vehicle: req.params.planetVehicleId,
		completed: completedDate,
		quantity: req.body.quantity,
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

// @desc    Create new vehicle
// @route   POST /api/vehicle
// @access  Private
const createVehicle = asyncHandler(async (req, res) => {
    const { name, type, description } = req.body

    if (!name || !type || !description) {
        res.status(400)
        throw new Error('Please add a name, type and description')
    }

    const vehicle = await Vehicle.create({
        name,
        type,
        description,
    })

    res.status(201).json(vehicle)
})

module.exports = {
    getPlanetVehicles,
    updatePlanetVehicle,
	createVehicle,
}