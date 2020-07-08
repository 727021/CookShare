<template>
    <b-modal
        id="shareCookbook"
        scrollable
        no-stacking
        :title="`Share ${editing.title}`"
        @show="shown"
    >
        <template v-slot:modal-header-close>
            <fa-icon icon="times" />
        </template>
        <template v-slot:modal-footer>
            <b-btn variant="outline-secondary" @click="hide">Cancel</b-btn>
            <b-btn variant="success" @click="submit">Save</b-btn>
        </template>
    </b-modal>
</template>

<script>
export default {
    name: "ShareCookbookModal",
    props: ["cookbook"],
    data: () => ({
        sharing: null
    }),
    methods: {
        show() {
            this.$bvModal.show("shareCookbook");
        },
        hide() {
            this.$bvModal.hide("shareCookbook");
        },
        shown() {
            // Get sharing for cookbook
        }
    }
};
</script>