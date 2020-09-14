const { validationResult } = require('express-validator')

const { Cookbook, Recipe, User } = require('../models/models')
const { isAdmin } = require('../util/isAuth')

/**
 * Used to sort comments by date
 */
const sortComments = (a, b) => (a.date > b.date ? -1 : 1)

// TODO Replace some 409 statuses with 401

//#region Cookbooks
exports.getCookbooks = async (req, res, next) => {
    try {
        const books = await Cookbook.find()
            .or([ { owner: req.user }, { 'shared.user': req.user, 'shared.status.accepted': true } ])
            .populate('owner', 'username')
            .populate('recipes.recipe')

        res.status(200).send(books || [])
    } catch (err) {
        next(err)
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const books = await Cookbook.find().populate('owner', 'username').populate('recipes.recipe')

        res.status(200).send(books || [])
    } catch (err) {
        next(err)
    }
}

exports.getCookbook = async (req, res, next) => {
    const { cid } = req.params

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await (isAdmin(req)
            ? Cookbook.findById(cid)
            : Cookbook.findById(cid).or([
                  { owner: req.user },
                  { 'shared.user': req.user, 'shared.status.accepted': true }
              ]))
            .populate('owner', 'username')
            .populate('recipes.recipe')
            .populate('recipes.recipe.author', 'username')
            .populate('recipes.comments.author', 'username')
        if (!book) return res.status(409).send({ error: 'Cookbook not found.' })

        res.status(200).send(book)
    } catch (err) {
        next(err)
    }
}

exports.createCookbook = async (req, res, next) => {
    const { title } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await new Cookbook({
            title,
            owner: req.user
        }).save()

        const newBook = await Cookbook.findById(book._id)
            .populate('owner', 'username')
            .populate('recipes.recipe')
            .populate('recipes.recipe.author', 'username')
            .populate('recipes.comments.author', 'username')
        if (!newBook) return res.status(409).send({ error: 'Failed to create cookbook.' })

        res.status(201).send(newBook)
    } catch (err) {
        next(err)
    }
}

exports.editCookbook = async (req, res, next) => {
    const { cid } = req.params
    const { title } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await (isAdmin(req)
            ? Cookbook.findByIdAndUpdate(cid, { title })
            : Cookbook.findOneAndUpdate({ _id: cid, owner: req.user }, { title })).populate('owner', 'username')
        if (!book) return res.status(409).send({ error: 'Cookbook not found' })

        res.status(200).send(book)
    } catch (err) {
        next(err)
    }
}

exports.deleteCookbook = async (req, res, next) => {
    const { cid } = req.params

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await (isAdmin(req)
            ? Cookbook.findByIdAndDelete(cid)
            : Cookbook.findOneAndDelete({ _id: cid, owner: req.user }))
        if (!book) return res.status(409).send({ error: 'Cookbook not found' })

        res.status(204).end()
    } catch (err) {
        next(err)
    }
}
//#endregion

//#region Recipes
const populateRecipes = async recipes => {
    const populated = []
    try {
        for (const { recipe } of recipes) populated.push(await Recipe.findById(recipe).populate('author', 'username'))
    } catch (err) {
        console.error(err)
    } finally {
        return populated
    }
}

exports.getRecipes = async (req, res, next) => {
    const { cid } = req.params

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await Cookbook.findById(cid).or([
            { owner: req.user },
            { 'shared.user': req.user, 'shared.status.accepted': true }
        ])
        if (!book) return res.status(409).send({ error: 'Cookbook not found' })

        res.status(200).send(await populateRecipes(book.recipes))
    } catch (err) {
        next(err)
    }
}

exports.addRecipe = async (req, res, next) => {
    const { cid, rid } = req.params

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await Cookbook.findById(cid).or([
            { owner: req.user },
            { 'shared.user': req.user, 'shared.status.accepted': true }
        ])
        if (!book) return res.status(409).send({ error: 'Cookbook not found' })
        const recipe = await Recipe.findOne({ _id: rid, author: req.user })
        if (!recipe) return res.status(409).send({ error: 'Recipe not found' })
        const recipes = book.recipes.map(r => r.recipe.toString())
        if (!recipes.some(r => r === recipe._id.toString())) book.recipes.push({ recipe: recipe._id, comments: [] })
        const updatedBook = await book.save()
        if (!updatedBook) return res.status(409).send({ error: 'Failed to add recipe' })

        res.status(201).send(updatedBook)
    } catch (err) {
        next(err)
    }
}

exports.removeRecipe = async (req, res, next) => {
    const { cid, rid } = req.params

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await Cookbook.findById(cid).or([
            { owner: req.user },
            { 'shared.user': req.user, 'shared.status.accepted': true }
        ])
        if (!book) return res.status(409).send({ error: 'Cookbook not found' })
        const recipe = await Recipe.findOne({ _id: rid, author: req.user })
        if (!recipe) return res.status(409).send({ error: 'Recipe not found' })
        book.recipes = book.recipes.filter(r => r.recipe.toString() !== recipe._id.toString())
        const updatedBook = await book.save()
        if (!updatedBook) return res.status(409).send({ error: 'Failed to add recipe' })

        res.status(204).end()
    } catch (err) {
        next(err)
    }
}
//#endregion

//#region Comments
exports.getComments = async (req, res, next) => {
    const { cid, rid } = req.params

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await Cookbook.findOne({ _id: cid, 'recipes.recipe': rid }).populate(
            'recipes.comments.author',
            'username'
        )
        if (!book) return res.status(409).send({ error: 'Cookbook not found' })
        const comments = book.recipes.find(r => r.recipe.toString() === rid.toString()).comments.sort(sortComments)

        res.status(200).send(comments || [])
    } catch (err) {
        next(err)
    }
}

exports.addComment = async (req, res, next) => {
    const { cid, rid } = req.params
    const { message } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await Cookbook.findOne({ _id: cid, 'recipes.recipe': rid }).or([
            { owner: req.user },
            { 'shared.user': req.user, 'shared.status.accepted': true }
        ])
        if (!book) return res.status(409).send({ error: 'Cookbook not found' })
        const recipe = book.recipes.findIndex(r => r.recipe.toString() === rid.toString())
        book.recipes[recipe].comments.push({
            author: req.user,
            message
        })

        const updatedBook = await Cookbook.populate(await book.save(), { path: 'recipes.comments.author' })
        if (!updatedBook) return res.status(409).send({ error: 'Failed to add comment' })

        const comments = updatedBook.recipes
            .find(r => r.recipe.toString() === rid.toString())
            .comments.sort(sortComments)

        res.status(201).send(comments)
    } catch (err) {
        next(err)
    }
}

exports.editComment = async (req, res, next) => {
    const { cid, rid, mid } = req.params
    const { message } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await Cookbook.findOne({ _id: cid, 'recipes.comments._id': mid })
        if (!book) return res.status(409).send({ error: 'Cookbook not found' })

        const iRecipe = book.recipes.findIndex(r => r.recipe._id.toString() === rid.toString())
        const iComment = book.recipes[iRecipe].comments.findIndex(c => c._id.toString() === mid.toString())
        if (!(isAdmin(req) || req.user._id.toString() === book.recipes[iRecipe].comments[iComment].author.toString()))
            return res.status(401).send({ error: 'Cookbook not found' })
        book.recipes[iRecipe].comments[iComment].message = message
        const updatedBook = await Cookbook.populate(await book.save(), { path: 'recipes.comments.author' })
        if (!updatedBook) return res.status(409).send({ error: 'Failed to edit comment' })
        const comments = updatedBook.recipes
            .find(r => r.recipe._id.toString() === rid.toString())
            .comments.sort(sortComments)

        res.status(200).send(comments)
    } catch (err) {
        next(err)
    }
}

exports.deleteComment = async (req, res, next) => {
    const { cid, rid, mid } = req.params

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await Cookbook.findOne({ _id: cid, 'recipes.comments._id': mid })
        if (!book) return res.status(409).send({ error: 'Cookbook not found' })

        const iRecipe = book.recipes.findIndex(r => r.recipe._id.toString() === rid.toString())
        const iComment = book.recipes[iRecipe].comments.findIndex(c => c._id.toString() === mid.toString())
        if (!(isAdmin(req) || req.user._id.toString() === book.recipes[iRecipe].comments[iComment].author.toString()))
            return res.status(401).send({ error: 'Cookbook not found' })
        book.recipes[iRecipe].comments = book.recipes[iRecipe].comments.filter(c => c._id.toString() !== mid.toString())
        const updatedBook = await book.save()
        if (!updatedBook) return res.status(409).send({ error: 'Failed to delete comment' })

        res.status(204).end()
    } catch (err) {
        next(err)
    }
}
//#endregion

//#region Sharing
exports.getSharing = async (req, res, next) => {
    const { cid } = req.params

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await Cookbook.findOne({ _id: cid, owner: req.user }, 'shared').populate('shared.user', 'username')
        if (!book) return res.status(409).send({ error: 'Cookbook not found' })

        res.status(200).send(book.shared)
    } catch (err) {
        next(err)
    }
}

exports.addSharing = async (req, res, next) => {
    const { cid, uid } = req.params
    const { status } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await Cookbook.findOne({ _id: cid, owner: req.user })
        if (!book) return res.status(409).send({ error: 'Cookbook not found' })
        const user = User.findById(uid)
        if (!user) return res.status(409).send({ error: 'User not found' })
        const shared = book.shared.findIndex(s => s.user.toString() === user._id.toString())
        if (shared < 0)
            book.shared.push({
                user,
                status
            })
        else book.shared[shared].status = status
        const updatedBook = await book.save().populate('shared.user', 'username')
        if (!updatedBook) return res.status(409).send({ error: 'Failed to share book' })

        res.status(201).send(updatedBook.shared)
    } catch (err) {
        next(err)
    }
}

exports.editSharing = async (req, res, next) => {
    const { cid, uid } = req.params
    const { status } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await Cookbook.findOne({ _id: cid, owner: req.user })
        if (!book) return res.status(409).send({ error: 'Cookbook not found' })
        const user = User.findById(uid)
        if (!user) return res.status(409).send({ error: 'User not found' })
        const shared = book.shared.findIndex(s => s.user.toString() === user._id.toString())
        if (shared < 0)
            book.shared.push({
                user,
                status
            })
        else book.shared[shared].status = status
        const updatedBook = await Cookbook.populate(await book.save(), { path: 'shared.user', select: 'username' })
        if (!updatedBook) return res.status(409).send({ error: 'Failed to update sharing' })

        res.status(200).send(updatedBook.shared)
    } catch (err) {
        next(err)
    }
}

exports.removeSharing = async (req, res, next) => {
    const { cid, uid } = req.params

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() })

    try {
        const book = await Cookbook.findOne({ _id: cid, owner: req.user })
        if (!book) return res.status(409).send({ error: 'Cookbook not found' })
        const user = User.findById(uid)
        if (!user) return res.status(409).send({ error: 'User not found' })
        const updatedSharing = book.sharing.filter(s => s.user.toString() === user._id.toString())
        if (updatedSharing.length === book.sharing.length) return res.status(204).end()
        book.sharing = updatedSharing
        const updatedBook = await book.save()
        if (!updatedBook) return res.status(409).send({ error: 'Failed to remove sharing' })

        res.status(204).end()
    } catch (err) {
        next(err)
    }
}
//#endregion
