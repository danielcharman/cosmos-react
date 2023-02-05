const mongoose = require('mongoose')

const planetVehicleSchema = mongoose.Schema({
    planet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Planet',
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Vehicle',
    },
    quantity: {
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

module.exports = mongoose.model('planetVehicles', planetVehicleSchema)