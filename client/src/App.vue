<template>
    <div id="app">
        <Header
            :username="user ? user.username : null"
            @show-login="$bvModal.show('loginModal')"
            @show-register="$bvModal.show('registerModal')"
            @logout="logout"
        />
        <router-view />
        <Footer />
        <!-- Log In Modal -->
        <b-modal
            id="loginModal"
            scrollable
            no-stacking
            no-close-on-backdrop
            no-close-on-esc
            title="Log In"
            @hidden="clearLogin"
        >
            <b-form @submit.prevent="null">
                <b-alert v-if="loginForm.error" show variant="danger">{{loginForm.error}}</b-alert>
                <b-form-group>
                    <b-form-input
                        v-model="loginForm.username"
                        placeholder="Username/email"
                        autocomplete="current-username"
                    ></b-form-input>
                </b-form-group>
                <b-form-group>
                    <b-form-input
                        v-model="loginForm.password"
                        placeholder="Password"
                        autocomplete="current-password"
                        type="password"
                    ></b-form-input>
                </b-form-group>
            </b-form>
            <template v-slot:modal-header-close>
                <fa-icon icon="times" />
            </template>
            <template v-slot:modal-footer>
                <b-btn variant="link" class="mr-auto" disabled>Forgot Password</b-btn>
                <b-btn variant="outline-secondary" v-b-modal.registerModal>Create Account</b-btn>
                <b-btn @click.prevent="login" variant="primary">Log In</b-btn>
            </template>
        </b-modal>

        <!-- <div v-if="loginVisible">
            <transition name="modal">
                <div class="modal-mask">
                    <div class="modal-wrapper">
                        <div class="modal-dialog modal-dialog-scrollable" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Log In</h5>
                                    <button
                                        type="button"
                                        class="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        @click="hideLogin"
                                    >
                                        <span aria-hidden="true">
                                            <i class="fas fa-times"></i>
                                        </span>
                                    </button>
                                </div>
                                <form @submit.prevent="login">
                                    <div class="modal-body">
                                        <div
                                            v-if="loginForm.error"
                                            class="alert alert-danger"
                                        >{{loginForm.error}}</div>
                                        <div class="form-group">
                                            <input
                                                v-model="loginForm.username"
                                                type="text"
                                                class="form-control"
                                                placeholder="Username/email"
                                                autocomplete="username"
                                            />
                                        </div>
                                        <div class="form-group">
                                            <input
                                                v-model="loginForm.password"
                                                type="password"
                                                class="form-control"
                                                placeholder="Password"
                                                autocomplete="current-password"
                                            />
                                        </div>
                                        <div class="text-center"></div>
                                    </div>
                                    <div class="modal-footer">
                                        <button
                                            class="btn btn-link mr-auto"
                                            disabled
                                        >Forgot Password</button>
                                        <button
                                            type="button"
                                            class="btn btn-outline-secondary"
                                            @click.prevent="showRegister"
                                        >Create Account</button>
                                        <button type="submit" class="btn btn-primary">Log In</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>-->
        <!-- TODO Create Account Modal -->
        <div v-if="registerVisible">
            <transition name="modal">
                <div class="modal-mask">
                    <div class="modal-wrapper">
                        <div class="modal-dialog modal-dialog-scrollable" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Create Account</h5>
                                    <button
                                        type="button"
                                        class="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        @click="hideRegister"
                                    >
                                        <span aria-hidden="true">
                                            <i class="fas fa-times"></i>
                                        </span>
                                    </button>
                                </div>
                                <form @submit.prevent="register">
                                    <div class="modal-body">
                                        <div class="form-group row">
                                            <div class="col-12 col-lg-6 mb-3 mb-lg-0">
                                                <input
                                                    v-model="registerForm.username.value"
                                                    :class="{'is-invalid': registerForm.username.error}"
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="Username"
                                                    autocomplete="username"
                                                />
                                                <div
                                                    v-if="registerForm.username.error"
                                                    class="invalid-feedback"
                                                >{{registerForm.username.error}}</div>
                                            </div>
                                            <div class="col-12 col-lg-6">
                                                <input
                                                    v-model="registerForm.email.value"
                                                    :class="{'is-invalid': registerForm.email.error}"
                                                    type="email"
                                                    class="form-control"
                                                    placeholder="Email"
                                                    autocomplete="email"
                                                />
                                                <div
                                                    v-if="registerForm.email.error"
                                                    class="invalid-feedback"
                                                >{{registerForm.email.error}}</div>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-12 col-lg-6 mb-3 mb-lg-0">
                                                <input
                                                    v-model="registerForm.firstname.value"
                                                    :class="{'is-invalid': registerForm.firstname.error}"
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="First name"
                                                    autocomplete="given-name"
                                                />
                                                <div
                                                    v-if="registerForm.firstname.error"
                                                    class="invalid-feedback"
                                                >{{registerForm.firstname.error}}</div>
                                            </div>
                                            <div class="col-12 col-lg-6">
                                                <input
                                                    v-model="registerForm.lastname.value"
                                                    :class="{'is-invalid': registerForm.lastname.error}"
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="Last name"
                                                    autocomplete="family-name"
                                                />
                                                <div
                                                    v-if="registerForm.lastname.error"
                                                    class="invalid-feedback"
                                                >{{registerForm.lastname.error}}</div>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-12 col-lg-6 mb-3 mb-lg-0">
                                                <input
                                                    v-model="registerForm.password.value"
                                                    :class="{'is-invalid': registerForm.password.error}"
                                                    type="password"
                                                    class="form-control"
                                                    placeholder="Password"
                                                    autocomplete="new-password"
                                                />
                                                <div
                                                    v-if="registerForm.password.error"
                                                    class="invalid-feedback"
                                                >{{registerForm.password.error}}</div>
                                            </div>
                                            <div class="col-12 col-lg-6">
                                                <input
                                                    v-model="registerForm.confirm.value"
                                                    :class="{'is-invalid': registerForm.confirm.error}"
                                                    type="password"
                                                    class="form-control"
                                                    placeholder="Confirm password"
                                                    autocomplete="new-password"
                                                />
                                                <div
                                                    v-if="registerForm.confirm.error"
                                                    class="invalid-feedback"
                                                >{{registerForm.confirm.error}}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button
                                            type="button"
                                            class="btn btn-outline-secondary"
                                            @click="showLogin"
                                        >Log In</button>
                                        <button type="submit" class="btn btn-primary">Create Account</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { isEmail } from "validator";
import { decode } from "jsonwebtoken";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import { register, login, logout } from "./services/AuthService";
import { getUser } from "./services/UserService";

export default {
    name: "app",
    components: {
        Header,
        Footer
    },
    data() {
        return {
            redirect: undefined,
            user: undefined,
            loginForm: {
                username: "",
                password: "",
                error: null
            },
            registerForm: {
                username: {
                    value: "",
                    error: null
                },
                email: {
                    value: "",
                    error: null
                },
                firstname: {
                    value: "",
                    error: null
                },
                lastname: {
                    value: "",
                    error: null
                },
                password: {
                    value: "",
                    error: null
                },
                confirm: {
                    value: "",
                    error: null
                }
            },
            loginVisible: false,
            registerVisible: false
        };
    },
    methods: {
        clearLogin() {
            for (let a in this.loginForm) {
                this.loginForm[a] = undefined;
            }
        },
        clearRegister() {
            for (const a in this.registerForm) {
                this.registerForm[a].error = null;
                this.registerForm[a].value = "";
            }
        },
        login() {
            login(this.loginForm.username, this.loginForm.password)
                .then(({ status, data }) => {
                    switch (status) {
                        case 200:
                            localStorage.setItem("token", data.token);
                            this.getUser()
                                .then(() => {
                                    this.$bvModal.hide("loginModal");
                                    if (this.redirect) {
                                        this.$router.push(this.redirect);
                                        this.redirect = undefined;
                                    }
                                })
                                .catch(err => {});
                            break;
                        case 401:
                            this.$bvModal.hide("loginModal");
                            this.getUser();
                            break;
                        case 422:
                            console.log(data);
                            this.loginForm.error =
                                data.error || "Invalid Login";
                            break;
                        default:
                            this.$bvModal.hide("loginModal");
                            this._500();
                            break;
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.$bvModal.hide("loginModal");
                    this._500();
                });
        },
        register() {
            register(
                this.registerForm.username.value,
                this.registerForm.email.value,
                this.registerForm.firstname.value,
                this.registerForm.lastname.value,
                this.registerForm.password.value,
                this.registerForm.confirm.value
            )
                .then(({ status, data }) => {
                    console.log(status, data);
                    switch (status) {
                        case 201:
                            this.$bvModal.show("loginModal");
                            this.loginForm.username = data.username;
                            break;
                        case 401:
                            this.$bvModal.hide("registerModal");
                            this.getUser();
                            break;
                        case 422:
                            for (const a in this.registerForm) {
                                this.registerForm[a].error = (
                                    data.errors.find(e => e.param === a) || {
                                        msg: null
                                    }
                                ).msg;
                            }
                            break;
                        default:
                            this.$bvModal.hide("registerModal");
                            this._500();
                            break;
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.$bvModal.hide("registerModal");
                    this._500();
                });
        },
        logout() {
            logout()
                .catch(err => {
                    console.error(err);
                    this.$bvModal.hide("loginModal");
                    this.$bvModal.hide("registerModal");
                    this._500();
                })
                .finally(() => {
                    this.user = undefined;
                    localStorage.removeItem("token");
                    if (this.$router.currentRoute.path !== "/")
                        this.$router.push("/");
                });
        },
        getUser() {
            return getUser()
                .then(({ status, data }) => {
                    switch (status) {
                        case 200:
                            this.user = data;
                            break;
                        case 401:
                            this._401();
                            break;
                        default:
                            this.$bvModal.hide("loginModal");
                            this.$bvModal.hide("registerModal");
                            this._500();
                            break;
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.$bvModal.hide("loginModal");
                    this.$bvModal.hide("registerModal");
                    this._500();
                });
        },
        _500() {
            this.$router.push("/500");
        },
        _401() {
            this.user = undefined;
            localStorage.removeItem("token");
        }
    },
    mounted() {
        this.getUser();

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

.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000080;
    display: table;
    transition: opacity 0.3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}
</style>
