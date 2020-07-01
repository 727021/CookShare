module.exports = {
    outputDir: '../server/public',
    devServer: {
        proxy: {
            '^/(api)|(pdf)|(uploads)': {
                target: 'http://localhost:3000'
            }
        }
    }
}
