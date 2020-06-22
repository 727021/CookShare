<template>
    <nav class="navbar fixed-bottom navbar-dark bg-dark">
        <div class="container justify-content-between">
            <div class="navbar-nav">
                <span class="nav-item">
                    <a class="nav-link" href="https://727021.github.io" target="_blank">
                        <i class="fab fa-github"></i>
                    </a>
                </span>
            </div>
            <span class="navbar-text">&copy;2020{{new Date().getFullYear() === 2020 ? '' : `-${new Date().getFullYear()}`}}</span>
        </div>
    </nav>
</template>