const mongoose = require('mongoose');

const Planet = require('./models/planetModel')
const Building = require('./models/buildingModel')
const PlanetBuilding = require('./models/planetBuildingModel')

const getPlanetResourceLimits = async (planetId) => {
    const gameOreStorage = await Building.findById('63da2803991967a1341b75d4')
    const gameCrystalStorage = await Building.findById('63da2842991967a1341b75d5')
    const gameGasStorage = await Building.findById('63da2878991967a1341b75d6')

    const planetOreStorage = await PlanetBuilding.findOne({
        planet: new mongoose.mongo.ObjectId(planetId),
        building: new mongoose.mongo.ObjectId('63da2803991967a1341b75d4')
    })

    const planetCrystalStorage = await PlanetBuilding.findOne({
        planet: new mongoose.mongo.ObjectId(planetId),
        building: new mongoose.mongo.ObjectId('63da2842991967a1341b75d5')
    })

    const planetGasStorage = await PlanetBuilding.findOne({
        planet: new mongoose.mongo.ObjectId(planetId),
        building: new mongoose.mongo.ObjectId('63da2878991967a1341b75d6')
    })

    const currentOreStorageLevel = (planetOreStorage) ? planetOreStorage.level : 1
    const currentCrystalStorageLevel = (planetCrystalStorage) ? planetCrystalStorage.level : 1
    const currentGasStorageLevel = (planetGasStorage) ? planetGasStorage.level : 1

    const oreCapacity = (gameOreStorage.production * ((gameOreStorage.productionMultiplier ?? 1.5) * currentOreStorageLevel))
    const crystalCapacity = (gameCrystalStorage.production * ((gameCrystalStorage.productionMultiplier ?? 1.5) * currentCrystalStorageLevel))
    const gasCapacity = (gameGasStorage.production * ((gameGasStorage.productionMultiplier ?? 1.5) * currentGasStorageLevel))

    return {
        ore: oreCapacity,
        crystal: crystalCapacity,
        gas: gasCapacity,
    }
}

module.exports = {
    getPlanetResourceLimits,
}