const {
    Schema,
    Schema: {
        Types: { ObjectId }
    },
    model
} = require('mongoose')
const { exists } = require('../util/units')

// TODO Add fields for `prep` and `cook` that store a number of minutes
const recipeSchema = new Schema({
    author: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        maxlength: 64
    },
    description: {
        type: String,
        required: false,
        maxlength: 1024
    },
    serving: {
        count: {
            type: Number,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        units: {
            type: String,
            required: false,
            validate: x => exists(x)
        }
    },
    ingredients: [
        {
            name: {
                type: String,
                required: true,
                maxlength: 64
            },
            amount: {
                type: Number,
                required: true
            },
            units: {
                type: String,
                required: false,
                validate: x => exists(x)
            }
        }
    ],
    steps: [
        {
            type: String,
            maxlength: 128
        }
    ],
    image: String
})

module.exports = model('Recipe', recipeSchema)
