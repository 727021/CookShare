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
                @keydown.ctrl.enter="submitComment"
            ></b-textarea>
            <template v-slot:invalid-feedback>
                <span class="float-left">{{ error }}</span>
            </template>
            <template v-slot:description>
                <span class="float-right">{{ message.length }}/256</span>
                <span class="float-right mr-4"
                    >*bold* /italics/ _underline_ ~strikethrough~</span
                >
            </template>
        </b-form-group>
        <b-btn-group class="w-100" v-if="mid">
            <b-btn variant="success" block @click="submitComment">Save</b-btn>
            <b-btn
                variant="outline-danger"
                @click="
                    mid = null;
                    message = '';
                "
                >Cancel</b-btn
            >
        </b-btn-group>
        <b-btn v-else variant="success" block @click="submitComment"
            >Submit</b-btn
        >
        <b-list-group style="max-height: 25rem;" class="mt-3 overflow-auto">
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
                :disabled="comment._id === mid"
            >
                <div
                    class="d-flex w-100 justify-content-between align-items-center"
                >
                    <div class="d-flex justify-content-left align-items-center">
                        <h5 class="mb-1">{{ comment.author.username }}</h5>
                        <small class="text-muted ml-3">{{
                            new Date(comment.date).toLocaleDateString()
                        }}</small>
                        <small
                            v-if="comment._id === mid"
                            class="text-muted ml-3"
                            >(<i>editing</i>)</small
                        >
                    </div>
                    <b-btn-group
                        v-if="
                            comment.author._id === user._id ||
                            owner._id === user._id
                        "
                        size="sm"
                    >
                        <b-btn
                            variant="outline-primary"
                            @click="
                                mid = comment._id;
                                message = unescapeBrackets(comment.message);
                            "
                            :disabled="comment._id === mid"
                            ><fa-icon icon="pencil-alt" />
                        </b-btn>
                        <b-btn
                            variant="outline-danger"
                            @click="doDeleteComment(comment._id)"
                            :disabled="comment._id === mid"
                            ><fa-icon icon="trash-alt" />
                        </b-btn>
                    </b-btn-group>
                </div>
                <p
                    :class="{ 'font-italic': comment._id === mid }"
                    class="text-break"
                    v-html="formatText(comment.message)"
                ></p>
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
    CONFLICT,
} from "../util/status-codes";
import { formatText, escapeBrackets, unescapeBrackets } from "../util/text";

export default {
    name: "RecipeComments",
    props: ["cid", "rid", "user", "owner"],
    data: () => ({
        loading: true,
        comments: [],
        mid: null,
        message: "",
        error: null,
    }),
    methods: {
        formatText,
        escapeBrackets,
        unescapeBrackets,
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
            const escaped = escapeBrackets(this.message);
            this.error = null;
            if (this.mid) {
                editComment(this.cid, this.rid, this.mid, escaped)
                    .then(({ status, data }) => {
                        switch (status) {
                            case SUCCESS:
                                this.mid = null;
                                this.message = "";
                                this.comments = data;
                                break;
                            case CONFLICT:
                                this.error = data.error;
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
                addComment(this.cid, this.rid, escaped)
                    .then(({ status, data }) => {
                        switch (status) {
                            case CREATED:
                                this.message = "";
                                this.comments = data;
                                break;
                            case CONFLICT:
                                this.error = data.error;
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
                        case CONFLICT:
                            this.error = data.error;
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