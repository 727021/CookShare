import { Resolve, Get, Post, Put, Delete } from './RequestSender'

import { CREATED, EMPTY } from '../util/status-codes'

const url = '/api/cookbook'

// Cookbooks
const getCookbooks = () => Resolve(Get(url))
const getCookbook = cid => Resolve(Get(`${url}/${cid}`))
const createCookbook = title => Resolve(Post(url, { title }), CREATED)
const editCookbook = (cid, title) => Resolve(Put(`${url}/${cid}`, { title }))
const deleteCookbook = cid => Resolve(Delete(`${url}/${cid}`), EMPTY)

// Recipes
const addRecipe = (cid, rid) => Resolve(Post(`${url}/${cid}/recipe/${rid}`), CREATED)
const removeRecipe = (cid, rid) => Resolve(Delete(`${url}/${cid}/recipe/${rid}`), EMPTY)

// Comments
const getComments = (cid, rid) => Resolve(Get(`${url}/${cid}/recipe/${rid}/comment`))
const addComment = (cid, rid, message) => Resolve(Post(`${url}/${cid}/recipe/${rid}/comment`, { message }), CREATED)
const editComment = (cid, rid, mid, message) => Resolve(Put(`${url}/${cid}/recipe/${rid}/comment/${mid}`, { message }))
const deleteComment = (cid, rid, mid) => Resolve(Delete(`${url}/${cid}/recipe/${rid}/comment/${mid}`), EMPTY)

// Sharing
const getSharing = cid => Resolve(Get(`${url}/${cid}/share`))
const addSharing = (cid, uid, status) => Resolve(Post(`${url}/${cid}/share/${uid}`, { status }), CREATED)
const editSharing = (cid, uid, status) => Resolve(Put(`${url}/${cid}/share/${uid}`, { status }))
const removeSharing = (cid, uid) => Resolve(Delete(`${url}/${cid}/share/${uid}`), EMPTY)

export {
    getCookbooks,
    getCookbook,
    createCookbook,
    editCookbook,
    deleteCookbook,
    addRecipe,
    removeRecipe,
    getComments,
    addComment,
    editComment,
    deleteComment,
    getSharing,
    addSharing,
    editSharing,
    removeSharing
}
