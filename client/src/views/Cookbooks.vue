<template>
    <div class="container">
        <h1 class="border-bottom">
            Cookbooks
            <b-spinner
                v-if="loading"
                class="m-2"
                style="border-width: 4px;"
            ></b-spinner>
            <b-btn
                variant="outline-success"
                class="float-right m-1 my-2"
                v-b-tooltip.hover.left
                title="New Cookbook"
                @click="$refs.createCookbookModal.show()"
            >
                <fa-icon icon="plus" />
            </b-btn>
            <b-btn
                variant="outline-primary"
                class="float-right m-1 my-2"
                v-b-tooltip.hover.left
                title="Share Cookbook"
                @click="$refs.shareCookbookModal.show()"
            >
                <fa-icon icon="users" />
            </b-btn>
        </h1>

        <CreateCookbookModal
            ref="createCookbookModal"
            :cookbooks="cookbooks"
            @401="$emit('401')"
            @500="_500"
        />

        <ShareCookbookModal
            ref="shareCookbookModal"
            :cookbook="sharing"
            @401="$emit('401')"
            @500="_500"
        />
    </div>
</template>

<script>
import CreateCookbookModal from "../components/CreateCookbookModal";
import ShareCookbookModal from "../components/ShareCookbookModal";

export default {
    name: "Cookbooks",
    props: ["user"],
    components: {
        CreateCookbookModal,
        ShareCookbookModal
    },
    data() {
        return {
            loading: true,
            currentCookbook: null,
            sharing: null,
            cookbooks: []
        };
    },
    methods: {
        _500(err) {
            this.$emit("500", err);
        }
    },
    mounted() {
        this.loading = false;
    }
};
</script>