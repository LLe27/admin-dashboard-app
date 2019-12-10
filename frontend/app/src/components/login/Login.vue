<template>
    <div class="login">
        <form id="sign-in" action="">
            <h1>Please sign in</h1>
            <div v-if="alertStatus" :class="['alert', alertType]">
                {{ alertMessage }}
            </div>
            <div class="form-group">
                <label for="loginInput">Email address</label>
                <input ref="emailInput" v-model="email" type="text" class="form-control" id="loginInput" aria-describedby="loginInput"
                    @keyup.enter.prevent="login()">
            </div>
            <div class="form-group">
                <label for="passwordInput">Password</label>
                <input ref="passwordInput" v-model="password" type="password" class="form-control" id="passwordInput"
                    @keyup.enter.prevent="login()">
            </div>
            <button ref="loginButton" type="button" class="btn btn-primary" @click="login()">Sign in</button>
            <div class="hr-or"></div>
            <router-link to="/signup" class="btn btn-primary">Register</router-link>
        </form>
    </div>
</template>

<script>
import auth from '../../js/auth';

export default {
    name: 'login',
    data() {
        return {
            alertMessage: '',
            alertStatus: false,
            alertType: '',
            email: '',
            password: ''
        }
    },
    methods: {
        invalidCredentials() {
            this.$refs.emailInput.classList.remove('is-valid');
            this.$refs.passwordInput.classList.remove('is-valid');
            this.$refs.emailInput.classList.add('is-invalid');
            this.$refs.passwordInput.classList.add('is-invalid');
        },
        async login() {
            /* eslint-disable */
            // Proxy should be used, but not be configured given the time frame
            let response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password
                    })
                })
                .then((res) => {
                    // Returned json response
                    return res.json();
                })
                .then((json) => {
                    // Authenticated user
                    if (json.result.match(/AUTHENTICATED/g)) {
                        // Set localstorage jwt token
                        auth.setToken(json.token);

                        // Set sucessful authentication message
                        this.$refs.loginButton.disabled = true;
                        this.validCredentials();
                        this.alertType = 'alert-success'
                        this.alertMessage = 'Successfully logged in! Please wait to be redirected...';
                        this.alertStatus = true;

                        // Redirect
                        setTimeout(() => {
                            this.$router.push({
                                path: '/status'
                            })
                        }, 2000);
                    } else {
                        // Provide frontend warnings
                        this.invalidCredentials();
                        this.alertType = 'alert-warning'
                        this.alertMessage = 'The credentials provided does not match or the account does not exist. Please try again.';
                        this.alertStatus = true;
                    }
                })
                .catch((err) => {
                    // Error handling
                    this.alertType = 'alert-warning'
                    this.alertMessage = 'An issue occured during the login process. Please contact customer support.';
                    this.alertStatus = true;
                });
        },
        validCredentials() {
            this.$refs.emailInput.classList.remove('is-invalid');
            this.$refs.passwordInput.classList.remove('is-invalid');
            this.$refs.emailInput.classList.add('is-valid');
            this.$refs.passwordInput.classList.add('is-valid');
        }
    },
    mounted() {
        // Unforgiving way to add a class to body
        let body = document.getElementsByTagName('body')[0];
        body.classList.add('bg-dark');
    }
}
</script>

<style scoped>
.login {
    height: 100%;
    width: 100%;
}
</style>