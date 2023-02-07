const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');

const Planet = require('../models/planetModel')

const {
    getPlanetResourceLimits
} = require('../game')

// @desc    Get all planets
// @route   GET /api/planets
// @access  Private
const getAllPlanets = asyncHandler(async (req, res) => {
    const planets = await Planet.find()

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

module.exports = {
    getAllPlanets,
	getUserPlanets,
}