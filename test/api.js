const { get } = require('axios').default

describe('/api', () => {
    describe('GET', () => {
        it('should return an empty object', done => {
            get('http://localhost:3000/api')
                .then(({ data }) => {
                    data = JSON.stringify(data)
                    if (data === '{}') done()
                    else done(new Error(`Server Response: ${data}`))
                })
                .catch(done)
        })
    })

    require('./api/auth')
    require('./api/user')
    require('./api/recipe')
    require('./api/cookbook')
})
