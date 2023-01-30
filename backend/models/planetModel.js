const mongoose = require('mongoose')

const planetSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    galaxy: {
        type: Number,
        required: true,
        default: 1,
    },
    system: {
        type: Number,
        required: true,
        default: 1,
    },
    position: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Please enter a name'],
    },
    temperature: {
        type: Number,
        required: [true, 'Please enter a temperature'],
    },
    size: {
        type: Number,
        required: [true, 'Please enter a size'],
    },
    ore: {
        type: Number,
        required: [true, 'Please enter a ore'],
        default: 0,
    },
    crystal: {
        type: Number,
        required: [true, 'Please enter a crystal'],
        default: 0,
    },
    gas: {
        type: Number,
        required: [true, 'Please enter a gas'],
        default: 0,
    },
}, 
{
    timestamps: true,
})

module.exports = mongoose.model('Planet', planetSchema)