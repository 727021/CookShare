module.exports = {
    outputDir: '../server/public',
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:3000'
            },
            '^/uploads': {
                target: 'http://localhost:3000'
            }
        }
    }
}
