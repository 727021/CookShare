const { unlink } = require('fs').promises

exports.deleteFile = filePath => unlink(filePath)
