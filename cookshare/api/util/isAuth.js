module.exports = {
    isAuth: req => Boolean(req.user),
    isAdmin: req => Boolean(req.user && req.user.admin)
}
