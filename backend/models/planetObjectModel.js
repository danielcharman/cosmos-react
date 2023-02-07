const mongoose = require('mongoose')

const planetObjectSchema = mongoose.Schema({
    planet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Planet',
    },
    object: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ConstructionObject',
    },
    amount: {
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

module.exports = mongoose.model('planetObject', planetObjectSchema)