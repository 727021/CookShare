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
        (req, res, next) => {
            const { title, description, serving, ingredients, steps } = req.body
            const image = req.file
            console.log({ title, description, serving, ingredients, steps, image })
            next()
        },
        [
            body('title', 'Please enter a title.')
                .isString()
                .notEmpty()
                .trim()
                .isLength({ max: 64 })
                .withMessage('Title is too long.'),
            body('description', 'Description must be shorter than 1024 characters.')
                .optional()
                .isString()
                .trim()
                .isLength({ max: 1024 })
                .withMessage('Description is too long.'),
            body('serving.count', 'Serving count must be at least 1.').isInt({ min: 1 }),
            body('serving.size', 'Serving size must be greater than 0.').isFloat({ gt: 0 }),
            body('serving.units', 'Invalid units.')
                .optional()
                .isString()
                .trim()
                .custom((value, { req }) => Unit.exists(value)),
            body('ingredients', 'Ingredients cannot be empty.').custom(value => value.length && value.length > 0),
            body('ingredients.*.name', 'Name cannot be empty.')
                .isString()
                .notEmpty()
                .trim()
                .isLength({ max: 64 })
                .withMessage('Name is too long.'),
            body('ingredients.*.amount', 'Amount must be greater than 0.').isFloat({ gt: 0 }),
            body('ingredients.*.units', 'Invalid units.')
                .optional()
                .isString()
                .trim()
                .custom((value, { req }) => Unit.exists(value)),
            body('steps', 'At least one step is required.').isArray().notEmpty(),
            body('steps.*', 'Step cannot be empty.')
                .isString()
                .notEmpty()
                .trim()
                .isLength({ max: 128 })
                .withMessage('Step is too long.')
        ],
        createRecipe
    )
    .put(
        '/:rid',
        needsAuth,
        [
            param('rid', 'Invalid recipe ID').isMongoId(),
            body('title', 'Please enter a title.')
                .isString()
                .notEmpty()
                .trim()
                .isLength({ max: 64 })
                .withMessage('Title is too long.'),
            body('description', 'Description must be shorter than 1024 characters.')
                .optional()
                .isString()
                .trim()
                .isLength({ max: 1024 })
                .withMessage('Description is too long.'),
            body('serving.count', 'Serving count must be at least 1.').isInt({ min: 1 }),
            body('serving.size', 'Serving size must be greater than 0.').isFloat({ gt: 0 }),
            body('serving.units', 'Invalid units.')
                .optional()
                .isString()
                .trim()
                .custom((value, { req }) => Unit.exists(value)),
            body('ingredients', 'Ingredients cannot be empty.').custom(value => value.length && value.length > 0),
            body('ingredients.*.name', 'Name cannot be empty.')
                .isString()
                .notEmpty()
                .trim()
                .isLength({ max: 64 })
                .withMessage('Name is too long.'),
            body('ingredients.*.amount', 'Amount must be greater than 0.').isFloat({ gt: 0 }),
            body('ingredients.*.units', 'Invalid units.')
                .optional()
                .isString()
                .trim()
                .custom((value, { req }) => Unit.exists(value)),
            body('steps', 'At least one step is required.').isArray().custom((value, { req }) => value.length > 0),
            body('steps.*', 'Step cannot be empty.')
                .isString()
                .notEmpty()
                .trim()
                .isLength({ max: 128 })
                .withMessage('Step is too long.'),
            body('changeImage').optional().toBoolean()
        ],
        editRecipe
    )
    .delete('/:rid', needsAuth, [ param('rid', 'Invalid recipe ID').isMongoId() ], deleteRecipe)

module.exports = router
