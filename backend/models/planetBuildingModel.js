const mongoose = require('mongoose')

const planetBuildingSchema = mongoose.Schema({
    planet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Planet',
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Building',
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

module.exports = mongoose.model('planetBuildings', planetBuildingSchema)