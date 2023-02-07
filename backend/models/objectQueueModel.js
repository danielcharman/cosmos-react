const mongoose = require('mongoose')

const objectQueueSchema = mongoose.Schema({
    planet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Planet',
    },
    object: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'PlanetObject',
    },
    type: {
        type: String,
        required: [true, 'Please select a type'],
        enum: ['Building','Technology','Vehicle'],
        default: 'Building',
    },
    action: {
        type: String,
        required: [true, 'Please select an action'],
        enum: ['Upgrade','Build'],
        default: 'Upgrade',
    },
    completed: {
        type: Date,
        required: [true, 'Please enter a date'],
    },
    amount: {
        type: Number,
        required: [true, 'Please enter an amount'],
    },
}, 
{
    timestamps: true,
})

module.exports = mongoose.model('ObjectsQueue', objectQueueSchema)