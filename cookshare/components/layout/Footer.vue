<template>
    <b-navbar type="dark" variant="dark" fixed="bottom">
        <b-container>
            <b-navbar-nav>
                <b-nav-item href="https://727021.github.io" target="_blank">
                    <fa-icon :icon="['fab', 'github']" />
                </b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-text
                    >&copy;2020{{
                        new Date().getFullYear() === 2020
                            ? ''
                            : `-${new Date().getFullYear()}`
                    }}</b-nav-text
                >
            </b-navbar-nav>
        </b-container>
    </b-navbar>
</template>

<script>
export default {
    name: 'Footer'
}
</script>
