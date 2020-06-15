const router = require('express').Router()
const { body, param } = require('express-validator')

const { needsAdmin, needsAuth } = require('../middleware/isAuth')

const {
    getCookbooks,
    getCookbook,
    getAll,
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
    deleteComment
} = require('../controllers/cookbook')

router
    .get('/', needsAuth, getCookbooks)
    .get('/all', needsAdmin, getAll)
    .post(
        '/recipe',
        needsAuth,
        [ body('cid', 'Invalid cookbook ID').isMongoId(), body('rid', 'Invalid recipe ID').isMongoId() ],
        addRecipe
    )
    .delete(
        '/recipe',
        needsAuth,
        [ body('cid', 'Invalid cookbook ID').isMongoId(), body('rid', 'Invalid recipe ID').isMongoId() ],
        removeRecipe
    )
    .post(
        '/share',
        needsAuth,
        [
            body('cid', 'Invalid cookbook ID').isMongoId(),
            body('uid', 'Invalid user ID').isMongoId(),
            body('status', 'Invalid sharing status').custom(
                (value, { req: { body: { status: { requested, invited, accepted, rejected } } } }) =>
                    [ requested, invited, accepted, rejected ].map(Boolean).reduce((sum, val) => (sum += val)) === 1
            )
        ],
        addSharing
    )
    .put(
        '/share',
        needsAuth,
        [
            body('cid', 'Invalid cookbook ID').isMongoId(),
            body('uid', 'Invalid user ID').isMongoId(),
            body('status', 'Invalid sharing status').custom(
                (value, { req: { body: { status: { requested, invited, accepted, rejected } } } }) =>
                    [ requested, invited, accepted, rejected ].map(Boolean).reduce((sum, val) => (sum += val)) === 1
            )
        ],
        editSharing
    )
    .delete(
        '/share',
        needsAuth,
        [ body('cid', 'Invalid cookbook ID').isMongoId(), body('uid', 'Invalid user ID').isMongoId() ],
        removeSharing
    )
    .post(
        '/comment',
        needsAuth,
        [
            body('cid', 'Invalid cookbook ID').isMongoId(),
            body('rid', 'Invalid recipe ID').isMongoId(),
            body('uid', 'Invalid user ID').isMongoId(),
            body('message', 'Invalid message')
                .isString()
                .trim()
                .isLength({ max: 256 })
                .withMessage('Comment cannot be longer than 256 characters.')
        ],
        addComment
    )
    .put(
        '/comment',
        needsAuth,
        [
            body('cid', 'Invalid cookbook ID').isMongoId(),
            body('rid', 'Invalid recipe ID').isMongoId(),
            body('mid', 'Invalid comment ID').isMongoId(),
            body('message', 'Invalid message')
                .isString()
                .trim()
                .isLength({ max: 256 })
                .withMessage('Comment cannot be longer than 256 characters.')
        ],
        editComment
    )
    .delete(
        '/comment',
        needsAuth,
        [
            body('cid', 'Invalid cookbook ID').isMongoId(),
            body('rid', 'Invalid recipe ID').isMongoId(),
            body('mid', 'Invalid comment ID').isMongoId()
        ],
        deleteComment
    )
    .get('/:cid', needsAuth, [ param('cid', 'Invalid cookbook ID').isMongoId() ], getCookbook)
    .post(
        '/',
        needsAuth,
        [
            body('title', 'Invalid title')
                .isString()
                .trim()
                .isLength({ max: 64 })
                .withMessage('Title cannot be longer than 64 characters.')
        ],
        createCookbook
    )
    .put(
        '/',
        needsAuth,
        [
            body('cid', 'Invalid cookbook ID').isMongoId(),
            body('title', 'Invalid title')
                .isString()
                .trim()
                .isLength({ max: 64 })
                .withMessage('Title cannot be longer than 64 characters.')
        ],
        editCookbook
    )
    .delete('/', needsAuth, [ body('cid', 'Invalid cookbook ID').isMongoId() ], deleteCookbook)

module.exports = router
