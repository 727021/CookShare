<template>
    <div class="container">
        <h1 class="border-bottom">
            Cookbooks
            <span
                v-if="loading"
                class="spinner-border m-2"
                style="border-width: 4px;"
                role="status"
            ></span>
            <button
                v-if="showCreate"
                @click="showCreate = false"
                class="btn btn-outline-danger m-1 my-2 float-right"
            >
                <fa-icon icon="times" />
            </button>
            <button
                v-else
                @click="newName = {value: '', error: null}; showCreate = true"
                class="btn m-1 my-2 btn-outline-success float-right"
                data-toggle="dropdown"
            >
                <fa-icon icon="plus" />
            </button>
            <!-- This isn't a great way to do this, but it works. -->
            <small v-if="showCreate" class="float-right text-muted">
                <small>
                    <small>
                        <small>
                            <small>{{newName.value.length}}/64</small>
                        </small>
                    </small>
                </small>
            </small>
            <input
                @keydown.enter.prevent="create"
                @keydown.esc.prevent="showCreate = false"
                v-if="showCreate"
                v-model="newName.value"
                :class="{'is-invalid': newName.error}"
                type="text"
                class="form-control float-right w-50 m-1 my-2"
                placeholder="New Cookbook (ENTER to submit...)"
                maxlength="64"
            />
        </h1>
    </div>
</template>

<script>
export default {
    name: "Cookbooks",
    data() {
        return {
            loading: true,
            showCreate: false,
            newName: {
                value: "",
                error: null
            },
            currentCookbook: null
        };
    },
    methods: {
        create() {
            console.log("Create cookbook:", this.newName.value);

            this.showCreate = false;
        }
    },
    mounted() {
        this.loading = false;
    }
};
</script>