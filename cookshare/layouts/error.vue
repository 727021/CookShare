<template>
    <div>
        <Header />
        <b-container class="mt-2 text-center">
            <div v-if="error.statusCode === 404">
                <h1 class="border-bottom">404 - Page Not Found</h1>
                <p>
                    Looks like the page at <code>{{ path }}</code> doesn't
                    exist!
                </p>
            </div>
            <div v-else>
                <h1 class="border-bottom">Server Error</h1>
                <p>
                    It looks like we ran into an unexpected error. Sorry for any
                    inconvenience. We'll get that fixed as soon as possible.
                </p>
            </div>
        </b-container>
        <Footer />
    </div>
</template>

<script>
export default {
    props: { error: Error },
    layout: 'error',
    computed: {
        path: () => this.$route.params.pathMatch
    }
}
</script>

<style scoped>
body {
    margin-top: 4rem !important;
    margin-bottom: 4rem !important;
}
</style>
