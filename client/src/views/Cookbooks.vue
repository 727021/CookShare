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

        <b-card-group v-if="cookbooks && cookbooks.length > 0" columns>
            <CookbookCard
                v-for="cookbook in cookbooks"
                :key="cookbook._id"
                :cookbook="cookbook"
                :cookbooks="cookbooks"
                :user="user"
            />
        </b-card-group>

        <h5 v-else-if="cookbooks && cookbooks.length === 0" class="text-center">
            No cookbooks
        </h5>
    </div>
</template>

<script>
import CreateCookbookModal from "../components/CreateCookbookModal";
import ShareCookbookModal from "../components/ShareCookbookModal";
import CookbookCard from "../components/CookbookCard";

import { getCookbooks } from "../services/CookbookService";

import {
    SUCCESS,
    CREATED,
    EMPTY,
    AUTH_ERROR,
    CONFLICT,
    DATA_ERROR
} from "../util/status-codes";

export default {
    name: "Cookbooks",
    props: ["user"],
    components: {
        CreateCookbookModal,
        ShareCookbookModal,
        CookbookCard
    },
    data() {
        return {
            loading: true,
            currentCookbook: null,
            sharing: null,
            cookbooks: null
        };
    },
    methods: {
        _500(err) {
            this.$emit("500", err);
        }
    },
    mounted() {
        getCookbooks()
            .then(({ status, data }) => {
                switch (status) {
                    case SUCCESS:
                        this.cookbooks = data;
                        this.loading = false;
                        break;
                    case AUTH_ERROR:
                        this.$router.push("/");
                        this.$emit("401");
                        break;
                    default:
                        this._500();
                        break;
                }
            })
            .catch(err => {
                this._500(err);
            });
    }
};
</script>