const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Building = require('../models/buildingModel')

// @desc    Get buildings
// @route   GET /api/buildings
// @access  Private
const getBuildings = asyncHandler(async (req, res) => {
    // const buildings = await Building.find({ user: req.user.id })
    const buildings = await Building.find()

    res.status(200).json(buildings)
})

// @desc    Get user building
// @route   GET /api/buildings/:id
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
    getBuildings,
    getBuilding,
    createBuilding,
    updateBuilding,
    deleteBuilding
}