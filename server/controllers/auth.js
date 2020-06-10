const { validationResult } = require('express-validator')
const { hash, compare } = require('bcrypt')

const User = require('../models/user')
const { SALT_ROUNDS } = require('../util/constants')

module.exports = {
    /**
     * Register a new user account
     */
    register: (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty) return res.status(422).send({ errors: errors.array() })

        const { email, username, firstname, lastname, password } = req

        hash(password, SALT_ROUNDS)
            .then(hash => {
                return new User({
                    email,
                    username,
                    password: hash,
                    name: {
                        first: firstname,
                        last: lastname
                    }
                }).save()
            })
            .then(user => {
                res.status(201).send({ username: user.username })
            })
            .catch(err => next(err))
    },

    /**
     * Log into an existing user account
     */
    login: (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty) return res.status(422).send({ errors: errors.array() })

        const { username, email, password } = req

        User.findOne(username ? { username } : { email })
            .then(user => {
                if (!user) return res.status(401).send({ error: 'Invalid Login' })
                return compare(password, user.password).then(same => {
                    if (!same) return res.status(401).send({ error: 'Invalid Login' })
                    return User.findByIdAndUpdate(user._id, { seen: Date.now() }).then(user => {
                        req.session.user = {
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                            name: user.name,
                            joined: user.joined,
                            seen: user.seen,
                            admin: user.admin
                        }
                        res.status(200).send(req.session.user)
                    })
                })
            })
            .catch(err => next(err))
    },

    /**
     * Log out of a user account
     */
    logout: (req, res, next) => {
        req.session.destroy(err => {
            if (err) return next(err)
            res.status(204).end()
        })
    },

    /**
     * Request a password reset
     */
    getPassword: (req, res, next) => {
        next()
    },

    /**
     * Reset a user's password
     */
    putPassword: (req, res, next) => {
        next()
    }
}
