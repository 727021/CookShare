import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import About from '../views/About'
import _404 from '../views/404'
import _500 from '../views/500'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: About
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

export default router
