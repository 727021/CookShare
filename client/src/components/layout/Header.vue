<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
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
    </nav>
</template>

<script>
import NavLink from "./NavLink";

export default {
    name: "Header",
    components: {
        NavLink
    },
    methods: {
        loggedIn() {
            return Boolean(localStorage.getItem("token"));
        }
    }
};
</script>

<style scoped>
</style>