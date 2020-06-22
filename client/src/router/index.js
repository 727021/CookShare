import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Profile from '../views/Profile'
import Recipes from '../views/Recipes'
import Recipe from '../views/Recipe'
import Cookbooks from '../views/Cookbooks'
import Cookbook from '../views/Cookbook'
import _500 from '../views/500'
import _404 from '../views/404'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Home'
        }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/recipes',
        name: 'Recipes',
        component: Recipes
    },
    {
        path: '/recipes/:rid',
        name: 'Recipe',
        component: Recipe
    },
    {
        path: '/cookbooks',
        name: 'Cookbooks',
        component: Cookbooks
    },
    {
        path: '/cookbooks/:cid',
        name: 'Cookbook',
        component: Cookbook
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
    document.title = (to.meta.title || to.name ? (to.meta.title || to.name) + ' - ' : '') + 'CookShare'
    next()
})

export default router
