const mongoose = require('mongoose')

const planetTechnologySchema = mongoose.Schema({
    planet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Planet',
    },
    technology: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Technology',
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

module.exports = mongoose.model('planetTechnologies', planetTechnologySchema)