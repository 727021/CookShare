const { Schema, Schema: { Types: { ObjectId } }, model } = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    joined: {
        type: Date,
        required: true,
        default: Date.now
    },
    seen: {
        type: Date,
        required: true,
        default: Date.now
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    resetToken: String,
    resetTokenExpiration: Date,
    favorites: [
        {
            type: ObjectId,
            required: true,
            ref: 'Recipe'
        }
    ],
    authToken: {
        type: String,
        required: false
    }
})

module.exports = model('User', userSchema)
