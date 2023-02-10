const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const User = require('../models/userModel')

const Planet = require('../models/planetModel')
const PlanetObject = require('../models/planetObjectModel')

const Mission = require('../models/missionModel')

const {
    getPlanetResourceLimits,
    registerPlanet,
} = require('../game')

// @desc    Get all planets
// @route   GET /api/planets
// @access  Private
const getSystemPlanets = asyncHandler(async (req, res) => {
    const planets = await Planet.find({
        galaxy: req.params.galaxy,
        system: req.params.system,
    })

	const newPlanets = await Promise.all(planets.map(async (planet) => {
        const resourceLimits = await getPlanetResourceLimits(planet._id)
		return {
            _id: planet._id,
            user: planet.user,
            galaxy: planet.galaxy,
            system: planet.system,
            position: planet.position,
            name: planet.name,
            temperature: planet.temperature,
            size: planet.size,
            resources: {
                ore: {
                    current: parseInt(planet.ore.toFixed(0)),
                    capacity: parseInt(resourceLimits.ore.toFixed(0)),
                },
                crystal: {
                    current: parseInt(planet.crystal.toFixed(0)),
                    capacity: parseInt(resourceLimits.crystal.toFixed(0)),
                },
                gas: {
                    current: parseInt(planet.gas.toFixed(0)),
                    capacity: parseInt(resourceLimits.gas.toFixed(0)),
                },
            }
		}
	})); 

    res.status(200).json(newPlanets)
})

// @desc    Get users planets
// @route   GET /api/users/:id/planets
// @access  Private
const getUserPlanets = asyncHandler(async (req, res) => {
    const planets = await Planet.find({ user: req.user.id })

	const newPlanets = await Promise.all(planets.map(async (planet) => {
        const resourceLimits = await getPlanetResourceLimits(planet._id)
		return {
            _id: planet._id,
            user: planet.user,
            galaxy: planet.galaxy,
            system: planet.system,
            position: planet.position,
            name: planet.name,
            temperature: planet.temperature,
            size: planet.size,
            resources: {
                ore: {
                    current: parseInt(planet.ore.toFixed(0)),
                    capacity: parseInt(resourceLimits.ore.toFixed(0)),
                },
                crystal: {
                    current: parseInt(planet.crystal.toFixed(0)),
                    capacity: parseInt(resourceLimits.crystal.toFixed(0)),
                },
                gas: {
                    current: parseInt(planet.gas.toFixed(0)),
                    capacity: parseInt(resourceLimits.gas.toFixed(0)),
                },
            }
		}
	})); 

    res.status(200).json(newPlanets)
})


const colonisePlanet = asyncHandler(async (req, res) => {
    const {source} = req.body
    const {galaxy, system, position} = JSON.parse(req.body.vector)

    const planet = await Planet.findOne({ 
        galaxy: galaxy, 
        system: system, 
        position: position, 
    })

    if (planet) {
        res.status(400)
        throw new Error('Cannot colonise occupied planet')
    }
    const user = await User.findById(req.user.id)
 
    const newPlanet = await registerPlanet(user, '', {
        galaxy: galaxy,
        system: system,
        position: position
    })


//----


    //check if upgrade is already queued
	const missionQueue = await Mission.findOne({
		user: req.user.id,
	}).sort({
		completed: 'desc'
	})

	let completedDate = new Date();
	if (missionQueue) {
		completedDate = new Date(missionQueue.completed)
	}
	completedDate.setSeconds(completedDate.getSeconds() + 600);

    console.log(newPlanet)

    const queuedMission = await Mission.create({
		user: req.user.id, 
		source: source,
		destination: newPlanet._id,
		action: 'Colonise',
		completed: completedDate, 
		distance: 10,
	})

    res.status(200).json([newPlanet, queuedMission])
})

const deletePlanet = asyncHandler(async (req, res) => {
    const planet = await Planet.findById(req.params.planetId) 

    if (!planet) {
        res.status(400)
        throw new Error('Planet doesnt exist')
    }

    await PlanetObject.deleteMany({
        planet: new mongoose.mongo.ObjectId(req.params.planetId),
    })

    await Planet.deleteOne({
        _id: new mongoose.mongo.ObjectId(req.params.planetId),
    })

    res.status(200).json()
})

module.exports = {
    getSystemPlanets,
	getUserPlanets,
    colonisePlanet,
    deletePlanet,
}