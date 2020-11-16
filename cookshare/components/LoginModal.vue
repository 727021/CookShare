<template>
    <b-modal
        id="loginModal"
        scrollable
        no-stacking
        title="Log In"
        @hidden="clear"
    >
        <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
        <b-form-group>
            <b-form-input
                v-model="username"
                placeholder="Username/email"
                autocomplete="current-username"
                @keydown.enter.prevent="submit"
            ></b-form-input>
        </b-form-group>
        <b-form-group>
            <b-form-input
                v-model="password"
                placeholder="Password"
                autocomplete="current-password"
                type="password"
                @keydown.enter.prevent="submit"
            ></b-form-input>
        </b-form-group>
        <template v-slot:modal-header-close>
            <fa-icon icon="times" />
        </template>
        <template v-slot:modal-footer>
            <b-btn variant="link" class="mr-auto" disabled
                >Forgot Password</b-btn
            >
            <b-btn variant="outline-secondary" @click="$emit('show-register')"
                >Create Account</b-btn
            >
            <b-btn variant="primary" @click.prevent="submit">Log In</b-btn>
        </template>
    </b-modal>
</template>

<script>
import { login } from '../services/AuthService'

import { SUCCESS, AUTH_ERROR, DATA_ERROR, CONFLICT } from '../util/status-codes'

export default {
    name: 'LoginModal',
    data: () => ({
        username: '',
        password: '',
        error: ''
    }),
    methods: {
        clear() {
            this.username = ''
            this.password = ''
            this.error = ''
        },
        submit() {
            login(this.username, this.password)
                .then(({ status, data }) => {
                    switch (status) {
                        case SUCCESS:
                            localStorage.setItem('token', data.token)
                            this.$emit('login-success')
                            break
                        case AUTH_ERROR:
                            this.$emit('401')
                            break
                        case DATA_ERROR:
                        case CONFLICT:
                            this.error = data.error || 'Invalid Login'
                            break
                        default:
                            this.$emit('500')
                            break
                    }
                })
                .catch(err => {
                    this.$emit('500', err)
                })
        },
        show(username) {
            if (username) this.username = username
            this.$bvModal.show('loginModal')
        },
        hide() {
            this.$bvModal.hide('loginModal')
        }
    }
}
</script>
