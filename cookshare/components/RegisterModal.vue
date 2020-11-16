<template>
    <b-modal
        id="registerModal"
        scrollable
        no-stacking
        title="Create Account"
        @hidden="clear"
    >
        <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
        <b-form-group :invalid-feedback="errors.username">
            <b-form-input
                v-model="values.username"
                :state="errors.username.length > 0 ? false : null"
                placeholder="Username"
                autocomplete="username"
                @keydown.enter.prevent="submit"
            ></b-form-input>
        </b-form-group>
        <b-form-group :invalid-feedback="errors.email">
            <b-form-input
                v-model="values.email"
                :state="errors.email.length > 0 ? false : null"
                type="email"
                placeholder="Email"
                autocomplete="email"
                @keydown.enter.prevent="submit"
            ></b-form-input>
        </b-form-group>
        <b-form-group :invalid-feedback="errors.firstname">
            <b-form-input
                v-model="values.firstname"
                :state="errors.firstname.length > 0 ? false : null"
                placeholder="First name"
                autocomplete="given-name"
                @keydown.enter.prevent="submit"
            ></b-form-input>
        </b-form-group>
        <b-form-group :invalid-feedback="errors.lastname">
            <b-form-input
                v-model="values.lastname"
                :state="errors.lastname.length > 0 ? false : null"
                placeholder="Last name"
                autocomplete="family-name"
                @keydown.enter.prevent="submit"
            ></b-form-input>
        </b-form-group>
        <b-form-group :invalid-feedback="errors.password">
            <b-form-input
                v-model="values.password"
                :state="errors.password.length > 0 ? false : null"
                type="password"
                placeholder="Password"
                autocomplete="new-password"
                @keydown.enter.prevent="submit"
            ></b-form-input>
        </b-form-group>
        <b-form-group :invalid-feedback="errors.confirm">
            <b-form-input
                v-model="values.confirm"
                :state="errors.confirm.length > 0 ? false : null"
                type="password"
                placeholder="Confirm password"
                autocomplete="new-password"
                @keydown.enter.prevent="submit"
            ></b-form-input>
        </b-form-group>

        <template v-slot:modal-header-close>
            <fa-icon icon="times" />
        </template>
        <template v-slot:modal-footer>
            <b-btn variant="outline-secondary" @click="$emit('show-login')"
                >Log In</b-btn
            >
            <b-btn variant="primary" @click.prevent="submit"
                >Create Account</b-btn
            >
        </template>
    </b-modal>
</template>

<script>
import { register } from '../services/AuthService'

import {
    CREATED,
    AUTH_ERROR,
    DATA_ERROR,
    CONFLICT
} from '../util/status-codes.js'

export default {
    name: 'RegisterModal',
    data: () => ({
        values: {
            username: '',
            email: '',
            firstname: '',
            lastname: '',
            password: '',
            confirm: ''
        },
        errors: {
            username: '',
            email: '',
            firstname: '',
            lastname: '',
            password: '',
            confirm: ''
        },
        error: ''
    }),
    methods: {
        clear() {
            for (const a in this.values) this.values[a] = ''
            for (const a in this.errors) this.errors[a] = ''
            this.error = ''
        },
        submit() {
            this.error = ''
            register(
                this.values.username,
                this.values.email,
                this.values.firstname,
                this.values.lastname,
                this.values.password,
                this.values.confirm
            )
                .then(({ status, data }) => {
                    switch (status) {
                        case CREATED:
                            this.$emit('register-success', this.values.username)
                            break
                        case AUTH_ERROR:
                            this.$emit('401')
                            break
                        case DATA_ERROR:
                            for (const a in this.errors)
                                this.errors[a] = (
                                    data.errors.find(e => e.param === a) || {
                                        msg: ''
                                    }
                                ).msg
                            break
                        case CONFLICT:
                            this.error = data.error
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
        show() {
            this.$bvModal.show('registerModal')
        },
        hide() {
            this.$bvModal.hide('registerModal')
        }
    }
}
</script>
