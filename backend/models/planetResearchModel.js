const mongoose = require('mongoose')

const planetResearchSchema = mongoose.Schema({
    planet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Planet',
    },
    research: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Research',
    },
    level: {
        type: Number,
        required: true,
        default: 1,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, 
{
    timestamps: true,
    strictQuery: false,
})

module.exports = mongoose.model('planetResearchs', planetResearchSchema)