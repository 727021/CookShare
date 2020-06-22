import Vue from 'vue'
import VueRouter from 'vue-router'
import { Home, Profile, Recipes, Recipe, Cookbooks, Cookbook, _500, _404 } from '../views/AllViews'

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
    },
    {
        path: '/recipes/:rid',
        name: 'Recipe',
        component: Recipe,
        meta: {
            needsAuth: true
        }
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
        path: '/cookbooks/:cid',
        name: 'Cookbook',
        component: Cookbook,
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
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.needsAuth && !localStorage.getItem('token')) next(new Error('Not logged in'))
    else next()
})

router.afterEach((to, from) => {
    document.title = to.name + ' - CookShare'
})

export default router
