const { createTransport } = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { renderFile } = require('ejs')

let templateDir = ''

const transporter = createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.SENDGRID_KEY,
        },
    })
)

const renderTemplate = async mail => {
    try {
        return await renderFile(mail.template, mail.data, {
            async: true,
            views: templateDir,
        })
    } catch (error) {
        console.error(error)
    }
}

class Mail {
    constructor(to, subject, template, data) {
        // TODO Validation/Sanitization
        this.to = to
        this.subject = subject
        this.content = content
    }

    async send() {
        transporter.sendMail({
            from: 'CookShare <cookshare@example.com>',
            to: Array.isArray(this.to) ? this.to.join(',') : this.to,
            subject: this.subject,
            html: await renderTemplate(this),
        })
    }
}

module.exports = views => {
    // TODO Validate views path(s)
    templateDir = views
    return Mail
}
