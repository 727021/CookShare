<template>
    <div>
        <h1 class="border-top my-4"></h1>
        <b-form-group class="mb-1">
            <b-textarea
                ref="commentBox"
                :state="error ? false : null"
                v-model="message"
                placeholder="Leave a comment..."
                maxlength="256"
                rows="3"
                max-rows="5"
                no-resize
            ></b-textarea>
            <template v-slot:invalid-feedback>
                <span class="float-left">{{ error }}</span>
            </template>
            <template v-slot:description>
                <span class="float-right">{{ message.length }}/256</span>
            </template>
        </b-form-group>
        <b-btn variant="success" block @click="submitComment">Submit</b-btn>
        <b-list-group class="mt-3">
            <b-list-group-item
                v-if="comments.length === 0"
                class="text-center"
                disabled
            >
                No Comments
            </b-list-group-item>
            <b-list-group-item
                v-for="comment in comments"
                :key="comment._id"
                class="flex-column align-items-start"
            >
                <div class="d-flex w-100 justify-content-left align-items-center">
                    <h5 class="mb-1">{{ comment.author.username }}</h5>
                    <span class="mx-1"></span>
                    <small class="text-muted">{{
                        new Date(comment.date).toLocaleDateString()
                    }}</small>
                </div>
                <p>{{ comment.message }}</p>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import {
    getComments,
    addComment,
    editComment,
    deleteCookbook,
    deleteComment,
} from "../services/CookbookService";

import {
    SUCCESS,
    CREATED,
    EMPTY,
    AUTH_ERROR,
    DATA_ERROR,
} from "../util/status-codes";

export default {
    name: "RecipeComments",
    props: ["cid", "rid", "user"],
    data: () => ({
        loading: true,
        comments: [],
        mid: null,
        message: "",
        error: null,
    }),
    methods: {
        loadComments() {
            this.error = null;
            this.loading = true;
            this.comments = [];
            getComments(this.cid, this.rid)
                .then(({ status, data }) => {
                    switch (status) {
                        case SUCCESS:
                            this.comments = data;
                            this.loading = false;
                            break;
                        case AUTH_ERROR:
                            this.$emit("401");
                            break;
                        default:
                            this.$emit("500");
                            break;
                    }
                })
                .catch((err) => {
                    this.$emit("500", err);
                });
        },
        submitComment() {
            this.error = null;
            if (this.mid) {
                editComment(this.cid, this.rid, this.mid, this.message)
                    .then(({ status, data }) => {
                        switch (status) {
                            case SUCCESS:
                                this.mid = null;
                                this.message = "";
                                this.comments = data;
                                break;
                            case DATA_ERROR:
                                this.error = data.errors[0].msg;
                                break;
                            case AUTH_ERROR:
                                this.$emit("401");
                                break;
                            default:
                                this.$emit("500");
                                break;
                        }
                    })
                    .catch((err) => {
                        this.$emit("500", err);
                    });
            } else {
                addComment(this.cid, this.rid, this.message)
                    .then(({ status, data }) => {
                        switch (status) {
                            case CREATED:
                                this.message = "";
                                this.comments = data;
                                break;
                            case DATA_ERROR:
                                this.error = data.errors[0].msg;
                                break;
                            case AUTH_ERROR:
                                this.$emit("401");
                                break;
                            default:
                                this.$emit("500");
                                break;
                        }
                    })
                    .catch((err) => {
                        this.$emit("500", err);
                    });
            }
        },
        doDeleteComment(mid) {
            this.error = null;
            deleteComment(this.cid, this.rid, mid)
                .then(({ status, data }) => {
                    switch (status) {
                        case EMPTY:
                            this.comments = this.comments.filter(
                                (m) => m._id !== mid
                            );
                            break;
                        case AUTH_ERROR:
                            this.$emit("401");
                            break;
                        default:
                            this.$emit("500");
                            break;
                    }
                })
                .catch((err) => {
                    this.$emit("500", err);
                });
        },
    },
    mounted() {
        this.loadComments();
    },
};
</script>