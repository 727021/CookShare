module.exports = {
    isAuth: req => Boolean(req.session.user),
    isAdmin: req => Boolean(req.session.user && req.session.user.admin)
}
