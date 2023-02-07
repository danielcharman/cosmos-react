const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');

const User = require('../models/userModel')

const Planet = require('../models/planetModel')

const ConstructionObject = require('../models/constructionObjectModel')
const PlanetObject = require('../models/planetObjectModel')

// @desc    Register a new user
// @route   /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password) {
        res.status(400)
        throw new Error ('Please include all fields')
    }

    // find if user already exists
    const userExists = await User.findOne({email: email})

    if(userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword, 
    })

    if(user) {
        const planet = await Planet.create({
            position: (Math.random() * (1000 - 100) + 100).toFixed(0),
            name: `${user.name}'s Planet`,
            temperature: (Math.random() * (50 - -10) + -10).toFixed(0),
            size: (Math.random() * (50000 - 10000) + 10000).toFixed(0),
            user: user._id,
        })

        const tempBuildings = await ConstructionObject.find({
            type: 'Building'
        })

        const buildings = await Promise.all(tempBuildings.map(async (object) => {
            let planetObject = await PlanetObject.findOne({
                planet: planet._id,
                object: object._id
            })
    
            if(!planetObject) {
                planetObject = await PlanetObject.create({
                    planet: planet._id,
                    object: object._id,
                    amount: 1,
                })
            }
    
            return
        }));  

        const tempTechnologies = await ConstructionObject.find({
            type: 'Technology'
        })

        const technologies = await Promise.all(tempTechnologies.map(async (object) => {
            let planetObject = await PlanetObject.findOne({
                planet: planet._id,
                object: object._id
            })
    
            if(!planetObject) {
                planetObject = await PlanetObject.create({
                    planet: planet._id,
                    object: object._id,
                    amount: 1,
                })
            }
    
            return
        })); 

        const tempVehicles = await ConstructionObject.find({
            type: 'Vehicle'
        })
    
        const vehicles = await Promise.all(tempVehicles.map(async (object) => {
            let planetObject = await PlanetObject.findOne({
                planet: planet._id,
                object: object._id
            })
    
            if(!planetObject) {
                planetObject = await PlanetObject.create({
                    planet: planet._id,
                    object: object._id,
                    amount: 1,
                })
            }
    
            return
        })); 

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Login a new user
// @route   /api/users
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email: email})

    //check user and password match
    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    }else{
        res.status(401)
        throw new Error('Invalid credentials')
    }
})

//secret bonus feature
const superDeleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId)

    const planets = await Planet.find({ 
        user: new mongoose.mongo.ObjectId(req.params.userId)
    })

    const deletedPlanetObjects = await Promise.all(planets.map(async (planet) => {
		let planetObjects = await PlanetObject.deleteMany({
			planet: new mongoose.mongo.ObjectId(planet._id),
		})

        console.log('DDD deleteing planetBuildings for ' + planet._id)

        return planetObjects
	})); 

    if(deletedPlanetObjects) {
        await Planet.deleteMany({
            user: new mongoose.mongo.ObjectId(req.params.userId)
        })

        await User.deleteOne({
            _id: new mongoose.mongo.ObjectId(req.params.userId),
        })
    }

    res.status(200).json(user)
})

// @desc    Register a new user
// @route   /api/users/linkUserPlanet/:planetId
// @access  Public
const linkUserPlanet = asyncHandler(async (req, res) => {
    
    const tempBuildings = await ConstructionObject.find({
		type: 'Building'
	})

    const buildings = await Promise.all(tempBuildings.map(async (object) => {
        let planetObject = await PlanetObject.findOne({
            planet: req.params.planetId,
            object: object._id
        })

        if(!planetObject) {
            planetObject = await PlanetObject.create({
                planet: req.params.planetId,
                object: object._id,
                amount: 1,
            })
        }

        return
    }));  

    const tempTechnologies = await ConstructionObject.find({
		type: 'Technology'
	})

    const technologies = await Promise.all(tempTechnologies.map(async (object) => {
        let planetObject = await PlanetObject.findOne({
            planet: req.params.planetId,
            object: object._id
        })

        if(!planetObject) {
            planetObject = await PlanetObject.create({
                planet: req.params.planetId,
                object: object._id,
                amount: 1,
            })
        }

        return
    })); 

    const tempVehicles = await Vehicle.find({
		type: 'Vehicle'
	})

    const vehicles = await Promise.all(tempVehicles.map(async (object) => {
        let planetObject = await PlanetObject.findOne({
            planet: req.params.planetId,
            object: object._id
        })

        if(!planetObject) {
            planetObject = await PlanetObject.create({
                planet: req.params.planetId,
                object: object._id,
                amount: 1,
            })
        }

        return
    })); 

    res.status(201).json()
  
})


//generate jwtoken
const generateToken = (id) => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    superDeleteUser,
    linkUserPlanet,
}