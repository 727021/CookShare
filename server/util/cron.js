const { schedule, validate } = require('node-cron')
const { readdir } = require('fs').promises
const { join } = require('path')

const { Recipe, User } = require('../models/models')
const { deleteFile } = require('./file')

const logError = (err, task) => {
    console.error(`Error in scheduled task${task ? ` '${task}':` : ':'}`)
    console.error(err)
}

const cleanUploads = async () => {
    try {
        console.log('Deleting unused image uploads...')
        const images = [].concat.apply([], (await Recipe.find({}, 'images')).map(r => r.images))
        const files = (await readdir(join(__dirname, '..', 'uploads'))).filter(
            file => !images.some(image => file === `/api/uploads/${image}`)
        )
        let deleted = 0
        files.forEach(async file => {
            try {
                await deleteFile(join(__dirname, '..', 'uploads', file))
            } catch (err) {
                logError(err, `clean uploads (${file})`)
            }
            deleted++
        })
        console.log('Deleted', deleted, 'unused images.')
    } catch (err) {
        logError(err, 'clean uploads')
    }
}

const cleanFavorites = async () => {
    try {
        console.log('Deleting nonexistent favorites...')
        const recipes = (await Recipe.find()).map(recipe => recipe._id.toString())
        const users = await User.find()
        let deleted = 0
        users.forEach(async user => {
            const newFavorites = user.favorites.filter(fav => recipes.some(r => r === fav))
            if (newFavorites.length !== user.favorites.length) {
                user.favorites = newFavorites
                try {
                    await user.save()
                    deleted += 1
                } catch (err) {
                    logError(err, `clean favorites (${user.username} : ${user._id})`)
                }
            }
        })
        console.log('Deleted favorites for', deleted, 'users.')
    } catch (err) {
        logError(err, 'clean favorites')
    }
}

const tasks = [
    // Clean uploads
    schedule('0 0 * * *', cleanUploads),
    // Clean favorites
    schedule('0 0 * * *', cleanFavorites)
]

module.exports = {
    tasks,
    startAll: () => {
        let started = 0
        tasks.forEach(task => {
            task.start()
            ++started
        })
        return started
    },
    stopAll: () => tasks.forEach(task => task.stop()),
    schedule: (cronExpression, func) => {
        if (!validate(cronExpression)) return null
        const task = schedule(cronExpression, func)
        tasks.push(task)
        return task
    },
    cleanUploads,
    cleanFavorites
}
