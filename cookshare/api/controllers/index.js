const { Recipe } = require('../models')
const PDF = require('pdfkit')

exports.echoToken = (req, res, next) => {
    res.send({ token: req.token })
}

exports.getPdf = async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.rid)
    // TODO Verify access to recipe is allowed

    res.setHeader('Content-Type', 'application/pdf')

    const pdf = new PDF()

    if (!recipe) {
        pdf.pipe(res)
        pdf.text('Recipe Not Found')
        return pdf.end()
    }

    // For file downloads
    // res.setHeader(
    //     'Content-Disposition',
    //     `attachment; filename="${recipe.title}.pdf"`
    // )

    pdf.pipe(res)

    // TODO Actually write the recipe to the PDF
    pdf.fontSize(24)
        .text(recipe.title)
        .fontSize('16')
        .text(recipe._id)
        // Check for data URLs
        .image(
            /^data/.test(recipe.image) ? recipe.image : 'server' + recipe.image
        )
        .end()
}

exports.get404 = (req, res, next) => {
    res.status(404).send({ url: req.url })
}

exports.get500 = (err, req, res, next) => {
    console.error(err)
    res.status(500).send({
        error:
            process.env.NODE_ENV === 'development'
                ? err.message
                : 'Server Error'
    })
}
