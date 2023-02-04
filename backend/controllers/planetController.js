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



module.exports = {
    getAllPlanets,
	getUserPlanets,
    getPlanet,
    createPlanet,
    updatePlanet,
    deletePlanet,
}