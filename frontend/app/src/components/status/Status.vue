<template>
    <div class="status">
        <header>
            <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <a class="navbar-brand" href="#">Company.inc</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <router-link to="/" class="nav-link">Home <span class="sr-only">(current)</span>
                            </router-link>
                        </li>
                    </ul>
                    <ul class="navbar-nav navbar-right">
                        <li class="nav-item">
                            <button class="btn btn-outline-secondary my-2 my-sm-0" type="submit"
                                @click="logout()">Logout</button>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <main role="main" class="container">
            <div class="main-content">
                <h1 class="mt-5">Welcome {{ getFullName }}!</h1>
                <p class="lead">
                    Status Page
                </p>
            </div>
        </main>
    </div>
</template>

<script>
import auth from '../../js/auth';

export default {
    name: 'status',
    data() {
        return {
            user: {}
        }
    },
    methods: {
        async getUser() {
            /* eslint-disable */
            let user = await auth.getUser(auth.getToken());

            // Error handling
            if (!user) {
                // Logout user if token has expired or malformed
                auth.logout();
            }
            else {
                // Set current user
                this.user = user;
            }
        },
        logout() {
            // Logout
            auth.logout();

            // Redirect to login page
            this.$router.push({
                path: '/login'
            })
        }
    },
    computed: {
        getFullName() {
            return `${this.user.firstName} ${this.user.lastName}`;
        }
    },
    mounted() {
        // Unforgiving way to add a class to body
        let body = document.getElementsByTagName('body')[0];
        body.classList.remove('bg-dark');

        // Retrieve user
        this.getUser();
    }
}
</script>

<style scoped>
</style>