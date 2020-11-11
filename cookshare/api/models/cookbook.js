const {
    Schema,
    Schema: {
        Types: { ObjectId }
    },
    model
} = require('mongoose')

const statusSchema = new Schema({
    requested: Boolean,
    invited: Boolean,
    accepted: Boolean,
    rejected: Boolean
})

// TODO Change shared to accept ObjectId(user) or String(email)
const cookbookSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 64
    },
    owner: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    shared: [
        {
            _id: {
                type: ObjectId,
                required: true,
                auto: true
            },
            user: {
                type: ObjectId,
                required: true,
                ref: 'User'
            },
            status: {
                type: statusSchema,
                required: true,
                validate: ({ requested, invited, accepted, rejected }) =>
                    [requested, invited, accepted, rejected]
                        .map(Boolean)
                        .reduce((sum, val) => (sum += val)) === 1
            }
        }
    ],
    recipes: [
        {
            recipe: {
                type: ObjectId,
                required: true,
                ref: 'Recipe'
            },
            comments: [
                {
                    _id: {
                        type: ObjectId,
                        required: true,
                        auto: true
                    },
                    author: {
                        type: ObjectId,
                        required: true,
                        ref: 'User'
                    },
                    date: {
                        type: Date,
                        required: true,
                        default: Date.now
                    },
                    message: {
                        type: String,
                        required: true,
                        maxlength: 256
                    }
                }
            ]
        }
    ]
})

module.exports = model('Cookbook', cookbookSchema)
