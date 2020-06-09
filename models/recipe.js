const { Schema, Schema: { Types: { ObjectId } }, model } = require('mongoose')
const { list } = require('convert-units')()

const recipeSchema = new Schema({
    author: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
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
            required: true,
            validate: x => list().some(val => val.abbr === x)
        }
    },
    ingredients: [
        {
            name: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            units: {
                type: String,
                required: false,
                validate: x => list().some(val => val.abbr === x)
            }
        }
    ],
    steps: [ String ],
    images: [ String ]
})

module.exports = model('Recipe', recipeSchema)
