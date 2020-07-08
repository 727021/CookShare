<template>
    <b-modal
        id="createCookbook"
        scrollable
        no-stacking
        title="New Cookbook"
        @hidden="clear"
    >
        <b-form-group label="Title">
            <b-input
                placeholder="New Cookbook"
                v-model="title"
                :state="error ? false : null"
                maxlength="64"
                @keydown.enter.prevent="submit"
            ></b-input>
            <template v-slot:invalid-feedback>
                <span class="float-left">{{ error }}</span>
            </template>
            <template v-slot:description>
                <span class="float-right">{{ title.length }}/64</span>
            </template>
        </b-form-group>
        <template v-slot:modal-header-close>
            <fa-icon icon="times" />
        </template>
        <template v-slot:modal-footer>
            <b-btn variant="outline-secondary" @click="hide">Cancel</b-btn>
            <b-btn variant="success" @click="submit">Create</b-btn>
        </template>
    </b-modal>
</template>

<script>
import { createCookbook } from "../services/CookbookService.js";

import {
    CREATED,
    AUTH_ERROR,
    DATA_ERROR,
    CONFLICT
} from "../util/status-codes";

export default {
    name: "NewCookbookModal",
    props: ["cookbooks"],
    data: () => ({
        title: "",
        error: ""
    }),
    methods: {
        show() {
            this.$bvModal.show("createCookbook");
        },
        hide() {
            this.$bvModal.hide("createCookbook");
        },
        clear() {
            this.title = "";
            this.error = "";
        },
        submit() {
            this.error = "";
            createCookbook(this.title)
                .then(({ status, data }) => {
                    switch (status) {
                        case CREATED:
                            console.log(data);
                            this.cookbooks.push(data);
                            this.hide();
                            break;
                        case AUTH_ERROR:
                            this.$emit("401");
                            this.hide();
                            this.$router.push("/");
                            break;
                        case DATA_ERROR:
                            this.error = data.errors[0].msg;
                            break;
                        case CONFLICT:
                            this.error = data.error;
                            break;
                        default:
                            this.$emit("500");
                            break;
                    }
                })
                .catch(err => {
                    this.$emit("500", err);
                });
        }
    }
};
</script>