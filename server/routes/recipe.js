const router = require('express').Router()
const { body, param } = require('express-validator')

const {
    getRecipes,
    getAll,
    getUnits,
    getRecipe,
    createRecipe,
    editRecipe,
    deleteRecipe
} = require('../controllers/recipe')
const { needsAuth, needsAdmin } = require('../middleware/isAuth')
const Unit = require('../util/units')

router
    .get('/', needsAuth, getRecipes)
    .get('/all', needsAdmin, getAll)
    .get('/units', getUnits)
    .get('/:rid', needsAuth, [ param('rid', 'Invalid recipe ID').isMongoId() ], getRecipe)
    .post(
        '/',
        needsAuth,
        [
            body('title', 'Please enter a title.').isString().notEmpty().trim(),
            body('description', 'Description must be shorter than 1024 characters.')
                .optional()
                .isString()
                .trim()
                .isLength({ max: 1024 }),
            body('serving.count', 'Serving count must be at least 1.').isInt({ min: 1 }),
            body('serving.size', 'Serving size must be greater than 0.').isFloat({ gt: 0 }),
            body('serving.units', 'Invalid units.')
                .optional()
                .isString()
                .trim()
                .custom((value, { req }) => Unit.exists(value)),
            body('ingredients', 'Ingredients cannot be empty.').isArray().notEmpty(),
            body('ingredients.*.name', 'Ingredient name cannot be empty.').isString().notEmpty().trim(),
            body('ingredients.*.amount', 'Ingredient amount must be greater than 0.').isFloat({ gt: 0 }),
            body('ingredients.*.units', 'Invalid units.')
                .optional()
                .isString()
                .trim()
                .custom((value, { req }) => Unit.exists(value)),
            body('steps', 'At least one step is required.').isArray().notEmpty(),
            body('steps.*', 'Steps cannot be empty.').isString().notEmpty()
        ],
        createRecipe
    )
    .put(
        '/:rid',
        needsAuth,
        [
            param('rid', 'Invalid recipe ID').isMongoId(),
            body('title', 'Please enter a title.').isString().notEmpty().trim(),
            body('description', 'Description must be shorter than 1024 characters.')
                .optional()
                .isString()
                .trim()
                .isLength({ max: 1024 }),
            body('serving.count', 'Serving count must be at least 1.').isInt({ min: 1 }),
            body('serving.size', 'Serving size must be greater than 0.').isFloat({ gt: 0 }),
            body('serving.units', 'Invalid units.')
                .optional()
                .isString()
                .trim()
                .custom((value, { req }) => Unit.exists(value)),
            body('ingredients', 'Ingredients cannot be empty.').isArray().notEmpty(),
            body('ingredients.*.name', 'Ingredient name cannot be empty.').isString().notEmpty().trim(),
            body('ingredients.*.amount', 'Ingredient amount must be greater than 0.').isFloat({ gt: 0 }),
            body('ingredients.*.units', 'Invalid units.')
                .optional()
                .isString()
                .trim()
                .custom((value, { req }) => Unit.exists(value)),
            body('steps', 'At least one step is required.').isArray().notEmpty(),
            body('steps.*', 'Steps cannot be empty.').isString().notEmpty()
        ],
        editRecipe
    )
    .delete('/:rid', needsAuth, [ param('rid', 'Invalid recipe ID').isMongoId() ], deleteRecipe)

module.exports = router
