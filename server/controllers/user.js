const { validationResult } = require('express-validator')
const { hash } = require('bcrypt')

const { User, Cookbook, Recipe } = require('../models/models')
const { SALT_ROUNDS } = require('../util/constants')
const { isAdmin } = require('../util/isAuth')

exports.getSelf = (req, res, next) => {
    res.send(req.user)
}

exports.changePassword = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    const { password } = req.body

    try {
        const passhash = await hash(password, SALT_ROUNDS)
        req.user.password = passhash
        await req.user.save()
        res.status(204).end()
    } catch (err) {
        next(err)
    }
}

exports.getAll = async (req, res, next) => {
    try {
        res.send(await User.find({}, `${isAdmin(req) ? 'email ' : ''}username name joined seen admin`))
    } catch (err) {
        next(err)
    }
}

exports.getFavorites = async (req, res, next) => {
    try {
        const { favorites } = await User.findById(req.user._id, 'favorites')
            .populate('favorites.recipe', '-images')
            .populate('favorites.recipe.author', 'username')
        res.send(favorites || [])
    } catch (err) {
        next(err)
    }
}

exports.postFavorites = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    const { rid } = req.params

    try {
        const cookbook = await Cookbook.findOne({ 'recipes.recipe': rid }).or([
            { owner: req.user._id },
            { 'shared.user': req.user._id, 'shared.status.accepted': true }
        ])
        const recipe = await Recipe.findOne({ _id: rid, author: req.user })
        if (!cookbook && !recipe) return res.status(401).send({ error: 'Recipe not found' })
        if (!req.user.favorites.some(fav => fav.toString() === rid.toString())) req.user.favorites.push(rid)
        const { favorites } = await req.user.save()
        res.status(201).send(favorites)
    } catch (err) {
        next(err)
    }
}

exports.deleteFavorites = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    const { rid } = req.params

    req.user.favorites = req.user.favorites.filter(fav => fav.toString() !== rid.toString())

    try {
        await req.user.save()
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

exports.putAdmin = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    const { uid, admin } = req.body

    try {
        const user = await User.findByIdAndUpdate(uid, { admin })
        if (!user) return res.status(409).send({ error: 'User not found' })
        if (err) return next(err)
        res.status(200).send({
            _id: user._id,
            email: user.email,
            username: user.username,
            joined: user.joined,
            seen: user.seen,
            admin: user.admin
        })
    } catch (err) {
        next(err)
    }
}

exports.getUser = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    const { uid } = req.params

    try {
        const user = await User.findById(uid, `${isAdmin(req) ? 'email ' : ''}username name joined seen admin`)
        if (!user) return res.status(409).send({ error: 'User not found' })
        res.status(200).send(user)
    } catch (err) {
        next(err)
    }
}

exports.deleteUser = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ error: 'Invalid Login' })

    const { username, email, password } = req.body

    try {
        const user = await User.findOne(username ? { username } : { email })
        if (!user) return res.status(401).send({ error: 'Invalid Login' })
        const same = await compare(password, user.password)
        if (!same) return res.status(401).send({ error: 'Invalid Login' })
        await User.findByIdAndDelete(user._id)
        res.status(204).end()
    } catch (err) {
        next(err)
    }
}
