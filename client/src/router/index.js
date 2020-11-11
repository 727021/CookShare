import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store'
import { auth } from '../store/types'
const {
    getters: { IS_LOGGED_IN }
} = auth

import Home from '../views/Home'
import Profile from '../views/Profile'
import Recipes from '../views/Recipes'
import Cookbooks from '../views/Cookbooks'
import _500 from '../views/500'
import _404 from '../views/404'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: {
            needsAuth: true
        }
    },
    {
        path: '/recipes',
        name: 'Recipes',
        component: Recipes,
        meta: {
            needsAuth: true
        }
        // children: [
        //     {
        //         path: '/:rid',
        //         props: true
        //     }
        // ]
    },
    {
        path: '/cookbooks',
        name: 'Cookbooks',
        component: Cookbooks,
        meta: {
            needsAuth: true
        }
    },
    {
        path: '/500',
        name: '500',
        component: _500
    },
    {
        path: '*',
        name: '404',
        component: _404
    }
]

const router = new VueRouter({
    routes,
    linkActiveClass: 'active',
    linkExactActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
    // TODO if (to.meta.needsAuth && store.getters[`auth/${IS_LOGGED_IN}`]) { // Use Vuex store instead of localStorage
    if (to.meta.needsAuth && !localStorage.getItem('token')) {
        // TODO Maybe store global error in store instead of throwing here
        const err = new Error()
        err.message = to.path
        err.name = 'NotLoggedIn'
        next(err)
    } else next()
})

router.afterEach((to, from) => {
    document.title = to.name + ' - CookShare'
})

export default router
