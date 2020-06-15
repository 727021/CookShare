const { validationResult } = require('express-validator')
const { hash, compare } = require('bcrypt')

const User = require('../models/user')
const { SALT_ROUNDS } = require('../util/constants')

exports.register = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    const { email, username, firstname, lastname, password } = req.body

    try {
        const passhash = await hash(password, SALT_ROUNDS)
        const user = await new User({
            email,
            username,
            password: passhash,
            name: {
                first: firstname,
                last: lastname
            }
        }).save()
        if (!user) return res.status(409).send({ error: 'Registration failed.' })
        res.status(201).send({ username: user.username })
    } catch (err) {
        next(err)
    }
}

exports.login = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ error: 'Invalid Login' })

    const { username, email, password } = req.body

    try {
        const user = await User.findOne(username ? { username } : { email }, 'password')
        if (!user) return res.status(401).send({ error: 'Invalid login' })
        const same = await compare(password, user.password)
        if (!same) return res.status(401).send({ error: 'Invalid login' })
        const loggedInUser = await User.findByIdAndUpdate(user._id, { seen: Date.now() })
        if (!loggedInUser) return res.status(401).send({ error: 'Invalid login' })
        req.session.user = {
            _id: loggedInUser._id,
            username: loggedInUser.username,
            email: loggedInUser.email,
            name: loggedInUser.name,
            joined: loggedInUser.joined,
            seen: loggedInUser.seen,
            admin: loggedInUser.admin
        }
        req.session.save(err => {
            if (err) return next(err)
            res.status(200).send(req.session.user)
        })
    } catch (err) {
        next(err)
    }
}

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) return next(err)
        res.status(204).end()
    })
}

// TODO Implement password resets
exports.getPassword = (req, res, next) => {
    // 501 = Not Implemented
    res.status(501).end()
}

exports.putPassword = (req, res, next) => {
    res.status(501).end()
}
