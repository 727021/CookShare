import { Resolve, Get, Post, Put, Delete } from './RequestSender'

import { objToFormData } from '../util/formify'
import { CREATED, EMPTY } from '../util/status-codes'

const url = '/api/recipe'

const getRecipes = () => Resolve(Get(url))
const getUnits = () => Resolve(Get(`${url}/units`))
const createRecipe = recipe => Resolve(Post(url, objToFormData(recipe)), CREATED)
const editRecipe = recipe => {
    const { _id, ...newRecipe } = recipe
    return Resolve(Put(`${url}/${_id}`, objToFormData(newRecipe)))
}
const deleteRecipe = recipe => Resolve(Delete(`${url}/${recipe._id}`), EMPTY)

export { getRecipes, getUnits, createRecipe, editRecipe, deleteRecipe }
