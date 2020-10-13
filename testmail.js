require('dotenv').config()
const { join } = require('path')
const {} = process.env
const Mail = require('./server/util/mail')(join('server', 'views', 'email'))

const testMail = new Mail(
    'andrewschim@gmail.com',
    'Test Email',
    {
        msg: 'This is a test email.',
    },
    'test'
)

;(async () => {
    try {
        await testMail.send()
        console.log('Email Sent')
    } catch (error) {
        console.error(error)
    }
})()
