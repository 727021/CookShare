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
        </h1>

        <CreateCookbookModal
            ref="createCookbookModal"
            :cookbooks="cookbooks"
            @401="$emit('401')"
            @500="_500"
        />

        <ShareCookbookModal
            ref="shareCookbookModal"
            @401="$emit('401')"
            @500="_500"
        />

        <AddRecipeModal
            ref="addRecipeModal"
            @401="$emit('401')"
            @500="_500"
            @add="doAddRecipe"
        />

        <b-card-group v-if="cookbooks && cookbooks.length > 0" columns>
            <CookbookCard
                v-for="cookbook in cookbooks"
                :key="cookbook._id"
                :cookbook="cookbook"
                :cookbooks="cookbooks"
                :user="user"
                @open="null /* TODO Implement opening a cookbook */"
                @sharing="null /* TODO Implement opening cookbook sharing */"
                @add="$refs.addRecipeModal.show(cookbook)"
                @deleteCookbook="doDeleteCookbook"
                @500="_500"
                @401="$emit('401')"
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
import AddRecipeModal from "../components/AddRecipeModal";

import {
    getCookbooks,
    deleteCookbook,
    addRecipe,
} from "../services/CookbookService";

import {
    SUCCESS,
    CREATED,
    EMPTY,
    AUTH_ERROR,
    CONFLICT,
    DATA_ERROR,
} from "../util/status-codes";

export default {
    name: "Cookbooks",
    props: ["user"],
    components: {
        CreateCookbookModal,
        ShareCookbookModal,
        CookbookCard,
        AddRecipeModal,
    },
    data() {
        return {
            loading: true,
            currentCookbook: null,
            cookbooks: null,
        };
    },
    methods: {
        doDeleteCookbook(cookbook) {
            deleteCookbook(cookbook._id)
                .then(({ status }) => {
                    switch (status) {
                        case EMPTY:
                            this.cookbooks = this.cookbooks.filter(
                                (c) => c._id !== cookbook._id
                            );
                            break;
                        case AUTH_ERROR:
                            this.$emit("401");
                            break;
                        default:
                            this._500();
                            break;
                    }
                })
                .catch((err) => {
                    this._500(err);
                });
        },
        doAddRecipe(cid, rid) {
            addRecipe(cid, rid)
                .then(({ status, data }) => {
                    switch (status) {
                        case CREATED:
                            this.cookbooks[
                                this.cookbooks.findIndex((c) => c._id === cid)
                            ].recipes = JSON.parse(
                                JSON.stringify(data.recipes)
                            );
                            this.$refs.addRecipeModal.hide();
                            break;
                        case DATA_ERROR:
                            this.$refs.addRecipeModal.setError(
                                data.errors[0].msg
                            );
                            break;
                        case AUTH_ERROR:
                            this.$emit("401");
                            break;
                        case CONFLICT:
                            this.$refs.addRecipeModal.setError(data.error);
                            break;
                        default:
                            this._500();
                            break;
                    }
                })
                .catch((err) => {
                    this._500(err);
                });
        },
        _500(err) {
            this.$emit("500", err);
        },
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
            .catch((err) => {
                this._500(err);
            });
    },
};
</script>