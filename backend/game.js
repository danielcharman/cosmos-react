const mongoose = require('mongoose');

const Object = require('./models/constructionObjectModel')
const PlanetObject = require('./models/planetObjectModel')

const getPlanetResourceLimits = async (planetId) => {
    const oreStorageId = '63e0d55ef3d73c805e4d4aad'
    const crystalStorageId = '63e0d55ef3d73c805e4d4aae'
    const gasStorageId = '63e0d55ef3d73c805e4d4aaf'

    const gameOreStorage = await Object.findById(oreStorageId)
    const gameCrystalStorage = await Object.findById(crystalStorageId)
    const gameGasStorage = await Object.findById(gasStorageId)

    const planetOreStorage = await PlanetObject.findOne({
        planet: new mongoose.mongo.ObjectId(planetId),
        object: new mongoose.mongo.ObjectId(oreStorageId)
    })
 
    const planetCrystalStorage = await PlanetObject.findOne({
        planet: new mongoose.mongo.ObjectId(planetId),
        object: new mongoose.mongo.ObjectId(crystalStorageId)
    })

    const planetGasStorage = await PlanetObject.findOne({
        planet: new mongoose.mongo.ObjectId(planetId),
        object: new mongoose.mongo.ObjectId(gasStorageId)
    })

    const currentOreStorageLevel = (planetOreStorage) ? planetOreStorage.amount : 1
    const currentCrystalStorageLevel = (planetCrystalStorage) ? planetCrystalStorage.amount : 1
    const currentGasStorageLevel = (planetGasStorage) ? planetGasStorage.amount : 1

    const oreCapacity = (gameOreStorage.production * ((gameOreStorage.productionMultiplier ?? 1.5) * currentOreStorageLevel))
    const crystalCapacity = (gameCrystalStorage.production * ((gameCrystalStorage.productionMultiplier ?? 1.5) * currentCrystalStorageLevel))
    const gasCapacity = (gameGasStorage.production * ((gameGasStorage.productionMultiplier ?? 1.5) * currentGasStorageLevel))

    return {
        ore: oreCapacity,
        crystal: crystalCapacity,
        gas: gasCapacity,
    }
}

const getObjectResourceCosts = async (objectId, amount) => {
	//get planet and building details to calculate costs
	const object = await ConstructionObject.findById(planetObject.object)

	const {
		duration, 
		durationMultipler,
		ore, 
		oreMultipler,
		crystal,
		crystalMultipler,
		gas,
		gasMultipler
	} = object

    return {
        duration: duration * (durationMultipler * amount),
        ore: ore * (oreMultipler * amount),
        crystal: crystal * (crystalMultipler * amount),
        gas: gas * (gasMultipler * amount),
    }
}

module.exports = {
    getPlanetResourceLimits,
    getObjectResourceCosts
}