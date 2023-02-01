const mongoose = require('mongoose')

const buildingsQueueSchema = mongoose.Schema({
    building: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'PlanetBuilding',
    },
    completed: {
        type: Date,
        required: [true, 'Please enter a date'],
    },
    level: {
        type: Number,
        required: [true, 'Please enter a level'],
    },
}, 
{
    timestamps: true,
})

module.exports = mongoose.model('BuildingsQueue', buildingsQueueSchema)