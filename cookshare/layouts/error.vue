<template>
    <div>
        <Header />
        <b-container class="mt-2 text-center">
            <h1 class="border-bottom">
                {{ error.statusCode }} -
                {{
                    error.statusCode === 404 ? 'Page Not Found' : 'Server Error'
                }}
            </h1>
            <div v-if="error.statusCode === 404">
                <p>
                    Looks like the page at <code>{{ path }}</code> doesn't
                    exist!
                </p>
            </div>
            <div v-else>
                <p>
                    It looks like we ran into an unexpected error. Sorry for any
                    inconvenience. We'll get that fixed as soon as possible.
                </p>
            </div>
            <small class="text-muted">({{ error.message }})</small>
        </b-container>
        <Footer />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: { error: Object },
    layout: 'error',
    computed: {
        path(): string {
            return this.$route.fullPath
        }
    },
    mounted() {
        if (Vue.config.devtools)
            console.error(this.error.statusCode, this.error.message)
    }
})
</script>

<style scoped>
small {
    font-size: 65%;
}
</style>
