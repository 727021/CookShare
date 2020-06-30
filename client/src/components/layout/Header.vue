<template>
    <b-navbar toggleable="lg" type="dark" variant="dark" fixed="top">
        <b-container>
            <b-navbar-toggle target="top-nav-collapse"></b-navbar-toggle>
            <b-collapse id="top-nav-collapse" is-nav class="text-center text-lg-left">
                <b-navbar-brand>CookShare</b-navbar-brand>
                <hr class="d-lg-none" />
                <b-navbar-nav>
                    <b-nav-item to="/" :exact="true">Home</b-nav-item>
                    <b-nav-item to="/recipes">Recipes</b-nav-item>
                    <b-nav-item to="/cookbooks">Cookbooks</b-nav-item>
                </b-navbar-nav>
                <hr class="d-lg-none" />
                <b-navbar-nav v-if="username" class="ml-auto">
                    <b-nav-item to="/profile" :exact="true">{{username}}</b-nav-item>
                    <b-nav-item @click.prevent="$emit('logout')" href="/logout">Log Out</b-nav-item>
                </b-navbar-nav>
                <b-navbar-nav v-else class="ml-auto">
                    <b-nav-item @click.prevent="$emit('show-login')" href="/login">Log In</b-nav-item>
                    <b-nav-text class="d-none d-lg-inline-block">or</b-nav-text>
                    <b-nav-item
                        @click.prevent="$emit('show-register')"
                        href="/register"
                    >Create Account</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-container>
    </b-navbar>

    <!-- <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container">
            <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse text-center text-lg-left" id="navbarNav">
                <span class="navbar-brand">CookShare</span>
                <hr class="d-lg-none" />
                <ul class="navbar-nav mr-auto">
                    <NavLink page="/" exact="true" />
                    <NavLink page="/recipes" />
                    <NavLink page="/cookbooks" />
                </ul>
                <hr class="d-lg-none" />
                <ul v-if="!this.$parent.user" class="navbar-nav">
                    <li class="nav-item">
                        <a
                            @click.prevent="$emit('show-login')"
                            href="/login"
                            class="nav-link"
                        >Log In</a>
                    </li>
                    <li class="navbar-text d-none d-lg-inline-block">or</li>
                    <li class="nav-item">
                        <a
                            @click.prevent="$emit('show-register')"
                            href="/register"
                            class="nav-link"
                        >Create Account</a>
                    </li>
                </ul>
                <ul v-else class="navbar-nav">
                    <NavLink page="/profile" exact="true" :text="this.$parent.user.username" />
                    <li class="nav-item">
                        <a @click.prevent="$emit('logout')" href="#" class="nav-link">Log Out</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>-->
</template>

<script>
// import NavLink from "./NavLink";

export default {
    name: "Header",
    props: ["username"]
};
</script>

<style scoped>
</style>