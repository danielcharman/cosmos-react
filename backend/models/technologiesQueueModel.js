const mongoose = require('mongoose')

const technologiesQueueSchema = mongoose.Schema({
    planet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Planet',
    },
    technology: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'PlanetTechnology',
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

module.exports = mongoose.model('TechnologiesQueue', technologiesQueueSchema)