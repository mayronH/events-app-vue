<template>
    <nav
        class="navbar container"
        role="navigation"
        aria-label="main navigation"
    >
        <div class="navbar-brand">
            <a href="/" class="navbar-item">
                <strong class="is-size-4">
                    Animal Rescue League
                </strong>
            </a>

            <a
                role="button"
                class="navbar-burger burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbar" class="navbar-menu">
            <div class="navbar-start">
                <router-link to="/" class="navbar-item">Home</router-link>
                <router-link to="/about" class="navbar-item">About</router-link>
            </div>

            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <div v-if="!$auth.loading">
                            <a
                                v-if="!$auth.isAuthenticated"
                                @click="login"
                                class="button is-dark"
                            >
                                <strong>Sign in</strong>
                            </a>

                            <a
                                v-if="$auth.isAuthenticated"
                                @click="logout"
                                class="button is-dark"
                            >
                                <strong>Logout</strong>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: "Nav",
    methods: {
        login() {
            this.$auth.loginWithRedirect();
        },
        logout() {
            this.$auth.logout({
                returnTo: window.location.origin,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
nav {
    margin-top: 25px;
    margin-bottom: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #d88d00;
        }
    }
}
</style>
