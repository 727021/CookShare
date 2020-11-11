module.exports = (_, res, next) => {
    res.setHeader(
        'Access-Control-Allow-Origin',
        'https://cookshare.herokuapp.com'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type Authorization')
    next()
}
