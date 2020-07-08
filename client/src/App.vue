<template>
    <div id="app">
        <Header
            :user="user"
            @show-login="$refs.loginModal.show()"
            @show-register="$refs.registerModal.show()"
            @logout="doLogout"
        />
        <router-view :user="user" @401="_401" @500="_500" />
        <Footer />
        <LoginModal
            ref="loginModal"
            @show-register="$refs.registerModal.show()"
            @login-success="finishLogin"
            @401="doGetUser"
            @500="_500"
        />
        <RegisterModal
            ref="registerModal"
            @show-login="$refs.loginModal.show()"
            @register-success="finishRegister"
            @401="doGetUser"
            @500="_500"
        />
    </div>
</template>

<script>
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";

import { logout } from "./services/AuthService";
import { getUser } from "./services/UserService";

import { SUCCESS, AUTH_ERROR } from "./util/status-codes";

export default {
    name: "app",
    components: {
        Header,
        Footer,
        LoginModal,
        RegisterModal
    },
    data() {
        return {
            redirect: undefined,
            user: undefined
        };
    },
    methods: {
        finishLogin() {
            this.$refs.loginModal.hide();
            this.doGetUser().then(() => {
                if (this.redirect) this.$router.push(this.redirect);
            });
        },
        finishRegister(username) {
            this.$refs.loginModal.show(username);
        },
        doLogout() {
            logout()
                .catch(err => {
                    this._500(err);
                })
                .finally(() => {
                    this.user = undefined;
                    localStorage.removeItem("token");
                    if (this.$router.currentRoute.path !== "/")
                        this.$router.push("/");
                });
        },
        doGetUser() {
            return getUser()
                .then(({ status, data }) => {
                    switch (status) {
                        case SUCCESS:
                            this.user = data;
                            break;
                        case AUTH_ERROR:
                            this._401();
                            break;
                        default:
                            this._500();
                            break;
                    }
                })
                .catch(err => {
                    this._500(err);
                });
        },
        _500(err) {
            if (err) console.error(err);
            this.$refs.loginForm.hide();
            this.$refs.registerForm.hide();
            this.$router.push("/500");
        },
        _401() {
            this.user = undefined;
            localStorage.removeItem("token");
        }
    },
    mounted() {
        this.doGetUser();

        this.$router.onError(err => {
            if (err.name === "NotLoggedIn") {
                this.redirect = err.message;
                this.$bvModal.show("loginModal");
            }
        });
    }
};
</script>

<style>
body {
    margin-top: 4rem !important;
    margin-bottom: 4rem !important;
}
</style>
