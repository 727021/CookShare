<template>
    <b-navbar toggleable="lg" type="dark" variant="dark" fixed="top">
        <b-container>
            <b-navbar-toggle target="top-nav-collapse"></b-navbar-toggle>
            <b-collapse
                id="top-nav-collapse"
                is-nav
                class="text-center text-lg-left"
            >
                <b-navbar-brand>CookShare</b-navbar-brand>
                <hr class="d-lg-none" />
                <b-navbar-nav>
                    <b-nav-item to="/" :exact="true">Home</b-nav-item>
                    <b-nav-item to="/recipes">Recipes</b-nav-item>
                    <b-nav-item to="/cookbooks">Cookbooks</b-nav-item>
                </b-navbar-nav>
                <hr class="d-lg-none" />
                <b-navbar-nav v-if="isAuth" class="ml-auto">
                    <b-nav-item to="/profile" :exact="true">{{
                        user.username
                    }}</b-nav-item>
                    <b-nav-item to="/logout">Log Out</b-nav-item>
                </b-navbar-nav>
                <b-navbar-nav v-else class="ml-auto">
                    <b-nav-item to="/login">Log In</b-nav-item>
                    <b-nav-text class="d-none d-lg-inline-block">or</b-nav-text>
                    <b-nav-item to="/register">Create Account</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-container>
    </b-navbar>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'Header',
    computed: { ...mapState(['user']), ...mapGetters(['isAuth']) }
}
</script>
