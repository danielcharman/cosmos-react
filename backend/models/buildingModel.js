const mongoose = require('mongoose')

const buildingSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name'],
    },
    type: {
        type: String,
        required: [true, 'Please select a type'],
        enum: ['Resource','Storage','Production','Facility'],
        default: 'Resource',
    },
    description: {
        type: String,
        required: [true, 'Please enter a description'],
    },
    duration: {
        type: Number,
        required: [true, 'Please enter a duration'],
        default: 60,
    },
    durationMultipler: {
        type: Number,
        required: [true, 'Please enter a durationMultipler'],
        default: 1.5,
    },
    ore: {
        type: Number,
        required: [true, 'Please enter a base ore cost'],
        default: 1,
    },
    oreMultipler: {
        type: Number,
        required: [true, 'Please enter a oreMultipler'],
        default: 1.5,
    },
    crystal: {
        type: Number,
        required: [true, 'Please enter a base crystal cost'],
        default: 1,
    },
    crystalMultipler: {
        type: Number,
        required: [true, 'Please enter a crystalMultipler'],
        default: 1.5,
    },
    gas: {
        type: Number,
        required: [true, 'Please enter a base gas cost'],
        default: 1,
    },
    gasMultipler: {
        type: Number,
        required: [true, 'Please enter a gasMultipler'],
        default: 1.5,
    },
    production: {
        type: Number,
        required: [true, 'Please enter a base production value'],
        default: 1,
    },
    productionMultipler: {
        type: Number,
        required: [true, 'Please enter a productionMultipler'],
        default: 1.5,
    },
    attribute: {
        type: Number,
    },
    attributeMultipler: {
        type: Number,
    },
    requiredBuildings: {
        type: Array,
    },
    requiredResearch: {
        type: Array,
    },
}, 
{
    timestamps: true,
})

module.exports = mongoose.model('Building', buildingSchema)