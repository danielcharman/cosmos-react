const mongoose = require('mongoose')

const researchsQueueSchema = mongoose.Schema({
    planet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Planet',
    },
    research: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'PlanetResearch',
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

module.exports = mongoose.model('ResearchsQueue', researchsQueueSchema)