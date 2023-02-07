const mongoose = require('mongoose')

const constructionObjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name'],
    },
    type: {
        type: String,
        required: [true, 'Please select a type'],
        enum: ['Building','Technology','Vehicle'],
        default: 'Building',
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Resource','Storage','Production','Facility','Tactical','Specialist','General','Vehicle','Weapon'],
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
    durationMultiplier: {
        type: Number,
        required: [true, 'Please enter a durationMultiplier'],
        default: 1.5,
    },
    ore: {
        type: Number,
        required: [true, 'Please enter a base ore cost'],
        default: 1,
    },
    oreMultiplier: {
        type: Number,
        required: [true, 'Please enter a oreMultiplier'],
        default: 1.5,
    },
    crystal: {
        type: Number,
        required: [true, 'Please enter a base crystal cost'],
        default: 1,
    },
    crystalMultiplier: {
        type: Number,
        required: [true, 'Please enter a crystalMultiplier'],
        default: 1.5,
    },
    gas: {
        type: Number,
        required: [true, 'Please enter a base gas cost'],
        default: 1,
    },
    gasMultiplier: {
        type: Number,
        required: [true, 'Please enter a gasMultiplier'],
        default: 1.5,
    },
    production: {
        type: Number,
        required: [true, 'Please enter a base production value'],
        default: 1,
    },
    productionMultiplier: {
        type: Number,
        required: [true, 'Please enter a productionMultiplier'],
        default: 1.5,
    },
    attribute: {
        type: Number,
    },
    attributeMultiplier: {
        type: Number,
    },
    requiredObjects: {
        type: Array,
    },
}, 
{
    timestamps: true,
    strictQuery: false,
})

module.exports = mongoose.model('constructionObject', constructionObjectSchema)