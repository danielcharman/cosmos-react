const mongoose = require('mongoose')

const missionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    source: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Planet',
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Planet',
    },
    action: {
        type: String,
        required: [true, 'Please select an action'],
        enum: ['Colonise','Espionage','Attack','Deployment','Transport'],
        default: 'Transport',
    },
    completed: {
        type: Date,
        required: [true, 'Please enter a date'],
    },
    distance: {
        type: Number,
        required: [true, 'Please enter a distance'],
        default: 0,
    },
    ore: {
        type: Number,
        default: 0,
    },
    crystal: {
        type: Number,
        default: 0,
    },
    gas: {
        type: Number,
        default: 0,
    },
    objects: {
        type: Array,
    },
}, 
{
    timestamps: true,
})

module.exports = mongoose.model('Mission', missionSchema)