const router = require('express').Router()
const { body, param } = require('express-validator')

const { needsAdmin, needsAuth } = require('../middleware/isAuth')

const {
    getCookbooks,
    getCookbook,
    getAll,
    getRecipes,
    addRecipe,
    removeRecipe,
    addSharing,
    editSharing,
    removeSharing,
    createCookbook,
    editCookbook,
    deleteCookbook,
    addComment,
    editComment,
    deleteComment,
    getComments,
    getSharing
} = require('../controllers/cookbook')

router
    // Cookbooks
    .get('/', needsAuth, getCookbooks)
    .get('/all', needsAdmin, getAll)
    .get('/:cid', needsAuth, [ param('cid', 'Invalid cookbook ID').isMongoId() ], getCookbook)
    .post(
        '/',
        needsAuth,
        [
            body('title', 'Invalid title')
                .isString()
                .trim()
                .notEmpty()
                .withMessage('Title cannot be empty.')
                .isLength({ max: 64 })
                .withMessage('Title cannot be longer than 64 characters.')
        ],
        createCookbook
    )
    .put(
        '/:cid',
        needsAuth,
        [
            param('cid', 'Invalid cookbook ID').isMongoId(),
            body('title', 'Invalid title')
                .isString()
                .trim()
                .isLength({ max: 64 })
                .withMessage('Title cannot be longer than 64 characters.')
        ],
        editCookbook
    )
    .delete('/:cid', needsAuth, [ param('cid', 'Invalid cookbook ID').isMongoId() ], deleteCookbook)
    // Recipes
    .get('/:cid/recipe', needsAuth, [param('cid', 'Invalid cookbook ID').isMongoId()], getRecipes)
    .post(
        '/:cid/recipe/:rid',
        needsAuth,
        [ param('cid', 'Invalid cookbook ID').isMongoId(), param('rid', 'Invalid recipe ID').isMongoId() ],
        addRecipe
    )
    .delete(
        '/:cid/recipe/:rid',
        needsAuth,
        [ param('cid', 'Invalid cookbook ID').isMongoId(), param('rid', 'Invalid recipe ID').isMongoId() ],
        removeRecipe
    )
    // Comments
    .get(
        '/:cid/recipe/:rid/comment',
        needsAuth,
        [ param('cid', 'Invalid cookbook ID').isMongoId(), param('rid', 'Invalid recipe ID').isMongoId() ],
        getComments
    )
    .post(
        '/:cid/recipe/:rid/comment',
        needsAuth,
        [
            param('cid', 'Invalid cookbook ID').isMongoId(),
            param('rid', 'Invalid recipe ID').isMongoId(),
            body('message', 'Invalid message')
                .isString()
                .trim()
                .notEmpty()
                .withMessage('Comment cannot be empty.')
                .isLength({ max: 256 })
                .withMessage('Comment cannot be longer than 256 characters.')
        ],
        addComment
    )
    .put(
        '/:cid/recipe/:rid/comment/:mid',
        needsAuth,
        [
            param('cid', 'Invalid cookbook ID').isMongoId(),
            param('rid', 'Invalid recipe ID').isMongoId(),
            param('mid', 'Invalid comment ID').isMongoId(),
            body('message', 'Invalid message')
                .isString()
                .trim()
                .notEmpty()
                .withMessage('Comment cannot be empty.')
                .isLength({ max: 256 })
                .withMessage('Comment cannot be longer than 256 characters.')
        ],
        editComment
    )
    .delete(
        '/:cid/recipe/:rid/comment/:mid',
        needsAuth,
        [
            param('cid', 'Invalid cookbook ID').isMongoId(),
            param('rid', 'Invalid recipe ID').isMongoId(),
            param('mid', 'Invalid comment ID').isMongoId()
        ],
        deleteComment
    )
    // Sharing
    .get('/:cid/share', needsAuth, [ param('cid', 'Invalid cookbook ID').isMongoId() ], getSharing)
    .post(
        '/:cid/share/:uid',
        needsAuth,
        [
            param('cid', 'Invalid cookbook ID').isMongoId(),
            param('uid', 'Invalid user ID').isMongoId(),
            body('status', 'Invalid sharing status').custom(
                (value, { req: { body: { status: { requested, invited, accepted, rejected } } } }) =>
                    [ requested, invited, accepted, rejected ].map(Boolean).reduce((sum, val) => (sum += val)) === 1
            )
        ],
        addSharing
    )
    .put(
        '/:cid/share/:uid',
        needsAuth,
        [
            param('cid', 'Invalid cookbook ID').isMongoId(),
            param('uid', 'Invalid user ID').isMongoId(),
            body('status', 'Invalid sharing status').custom(
                (value, { req: { body: { status: { requested, invited, accepted, rejected } } } }) =>
                    [ requested, invited, accepted, rejected ].map(Boolean).reduce((sum, val) => (sum += val)) === 1
            )
        ],
        editSharing
    )
    .delete(
        '/:cid/share/:uid',
        needsAuth,
        [ param('cid', 'Invalid cookbook ID').isMongoId(), param('uid', 'Invalid user ID').isMongoId() ],
        removeSharing
    )

module.exports = router
