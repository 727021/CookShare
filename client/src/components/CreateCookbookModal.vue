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
            // Create the cookbook
        }
    }
};
</script>