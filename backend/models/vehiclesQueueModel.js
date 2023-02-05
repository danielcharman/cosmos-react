const mongoose = require('mongoose')

const vehiclesQueueSchema = mongoose.Schema({
    planet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Planet',
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'PlanetVehicle',
    },
    completed: {
        type: Date,
        required: [true, 'Please enter a date'],
    },
    quantity: {
        type: Number,
        required: [true, 'Please enter a quantity'],
    },
}, 
{
    timestamps: true,
})

module.exports = mongoose.model('VehiclesQueue', vehiclesQueueSchema)