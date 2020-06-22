<template>
    <div id="app">
        <Header @show-login="showLogin" @show-register="showRegister" @logout="logout" />
        <router-view />
        <Footer />
        <!-- Log In Modal -->
        <div v-if="loginVisible">
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
        </div>
        <!-- Create Account Modal -->
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
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { isEmail } from "validator";
import axios from "axios";
import { decode } from "jsonwebtoken";
import AuthService from "./services/AuthService";
import UserService from "./services/UserService";

export default {
    name: "app",
    components: {
        Header,
        Footer
    },
    data() {
        return {
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
        showLogin() {
            this.hideRegister();
            this.loginVisible = true;
        },
        showRegister() {
            this.hideLogin();
            this.registerVisible = true;
        },
        hideLogin() {
            this.loginVisible = false;
            for (let a in this.loginForm) {
                this.loginForm[a] = undefined;
            }
        },
        hideRegister() {
            this.registerVisible = false;
            for (const a in this.registerForm) {
                this.registerForm[a].error = null;
                this.registerForm[a].value = "";
            }
        },
        login() {
            AuthService.login(this.loginForm.username, this.loginForm.password)
                .then(({ status, data }) => {
                    switch (status) {
                        case 200:
                            localStorage.setItem("token", data.token);
                            this.user = decode(data.token);
                            this.hideLogin();
                            break;
                        case 401:
                            this.hideLogin();
                            this.getUser();
                            break;
                        case 422:
                            console.log(data);
                            this.loginForm.error =
                                data.error || "Invalid Login";
                            break;
                        default:
                            this.hideLogin();
                            this._500();
                            break;
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.hideLogin();
                    this._500();
                });
        },
        register() {
            AuthService.register(
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
                            this.showLogin();
                            this.loginForm.username = data.username;
                            break;
                        case 401:
                            this.hideRegister();
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
                            this.hideRegister();
                            this._500();
                            break;
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.hideLogin();
                    this._500();
                });
        },
        logout() {
            AuthService.logout()
                .catch(err => {
                    console.error(err);
                    this.hideLogin();
                    this._500();
                })
                .finally(() => {
                    this.user = undefined;
                    localStorage.removeItem("token");
                    this.$router.push("/");
                });
        },
        getUser() {
            UserService.getUser()
                .then(({ status, data }) => {
                    switch (status) {
                        case 200:
                            this.user = data;
                            break;
                        default:
                            this.hideRegister();
                            this._500();
                            break;
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.hideLogin();
                    this._500();
                });
        },
        _500() {
            this.$router.push("/500");
        }
    },
    mounted() {
        this.getUser();

        this.$router.onError(err => {
            if (err.message === "Not logged in") {
                this.showLogin();
            }
        });
    }
};
</script>

<style>
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
