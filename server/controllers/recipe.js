const { validationResult } = require('express-validator')

const Recipe = require('../models/recipe')
const { isAdmin } = require('../util/isAuth')
const Unit = require('../util/units')

exports.getRecipes = async (req, res, next) => {
    try {
        res.status(200).send(await Recipe.find({ author: req.user }))
    } catch (err) {
        next(err)
    }
}

exports.getAll = async (req, res, next) => {
    try {
        res.status(200).send(await Recipe.find().populate('author', 'username'))
    } catch (err) {
        next(err)
    }
}

exports.getUnits = (req, res, next) => {
    res.send(Unit.list())
}

exports.getRecipe = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    const { rid } = req.params

    try {
        const recipe = await Recipe.findById(rid).populate('author', 'username')

        if (!recipe) return res.status(409).send({ error: 'Recipe not found.' })
        if (!(req.user._id.toString() === recipe.author._id.toString() || isAdmin(req)))
            return res.status(401).send({ error: 'Recipe not found.' })

        res.status(200).send(recipe)
    } catch (err) {
        next(err)
    }
}

exports.createRecipe = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    const { title, description, serving, ingredients, steps, image } = req.body

    try {
        const recipe = await new Recipe({
            author: req.user._id,
            title,
            description,
            serving,
            ingredients,
            steps,
            image
        }).save()

        if (!recipe) return res.status(409).send({ error: 'Failed to create recipe.' })
        res.status(201).send(recipe)
    } catch (err) {
        next(err)
    }
}

exports.editRecipe = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    const { rid } = req.params
    const { title, description, serving, ingredients, steps, image } = req.body

    try {
        const recipe = await Recipe.findById(rid)

        if (!recipe) return res.status(409).send({ error: 'Recipe not found.' })
        if (!(req.user._id.toString() === recipe.author._id.toString() || isAdmin(req)))
            return res.status(401).send({ error: 'Recipe not found.' })

        recipe.title = title
        recipe.description = description
        recipe.serving = serving
        recipe.ingredients = ingredients
        recipe.steps = steps
        recipe.image = image

        const updatedRecipe = await recipe.save()

        if (!updatedRecipe) return res.status(409).send({ error: 'Failed to update recipe.' })
        res.status(200).send(updatedRecipe)
    } catch (err) {
        next(err)
    }
}

exports.deleteRecipe = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    const { rid } = req.params

    try {
        const recipe = isAdmin(req)
            ? await Recipe.findByIdAndDelete(rid)
            : await Recipe.findOneAndDelete({ _id: rid, author: req.user })
        if (!recipe) return res.status(409).send({ error: 'Failed to delete recipe.' })
        res.status(204).end()
    } catch (err) {
        next(err)
    }
}
