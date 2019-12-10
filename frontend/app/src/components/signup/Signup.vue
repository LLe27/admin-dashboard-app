<template>
    <div class="sign-up">
        <form id="sign-up" @submit.prevent>
            <h1>Sign Up</h1>
            <div v-if="alertStatus" :class="['alert', alertType]">
                {{ alertMessage }}
            </div>
            <h6 v-if="!checkForm()" class="text-danger">All fields are required.</h6>
            <div class="form-group">
                <label for="emailInput">Email address</label>
                <input ref="emailInput" v-model="email" type="text" class="form-control is-invalid" id="emailInput"
                    aria-describedby="loginInput" @input="validateEmail()">
                <small v-if="!validEmail" class="text-primary">Please enter a valid email address.</small>
            </div>
            <div class="form-group">
                <label for="firstNameInput">First name</label>
                <input v-model="firstName" type="text"
                    :class="['form-control', firstName.length>0 ? 'is-valid' : 'is-invalid']" id="firstNameInput"
                    aria-describedby="loginInput">
                <small v-if="!firstName>0" class="text-primary">Please enter a first name.</small>
            </div>
            <div class="form-group">
                <label for="lastNameInput">Last name</label>
                <input v-model="lastName" type="text"
                    :class="['form-control', lastName.length>0 ? 'is-valid' : 'is-invalid']" id="lastNameInput"
                    aria-describedby="loginInput">
                <small v-if="!lastName>0" class="text-primary">Please enter a last name.</small>
            </div>
            <div class="form-group">
                <label for="passwordInput">Password</label>
                <input ref="password" v-model="password" type="password" class="form-control is-invalid"
                    id="passwordInput" maxlength="20" @input="checkPasswords()">
                <small v-if="!validPassword" class="text-primary">Enter a password between 6 to 20 characters which
                    contain at least one numeric digit, one uppercase and one lowercase letter.</small>
            </div>
            <div class="form-group">
                <label for="reenterPasswordInput">Re-enter Password</label>
                <input ref="reenterPassword" v-model="reenterPassword" type="password" class="form-control is-invalid"
                    maxlength="20" id="reenterPasswordInput" @input="checkPasswords()">
                <small v-if="!matchPassword" class="text-primary">Please re-enter the password provided. Passwords must
                    match in order to be valid.</small>
            </div>
            <button type="submit" class="btn btn-primary" ref="submit" @click="signup()">Sign up</button>
            <div class="hr-or"></div>
            <router-link to="/login" class="btn btn-primary">Login</router-link>
        </form>
    </div>
</template>

<script>
import auth from '../../js/auth';

export default {
    name: 'signup',
    data() {
        return {
            alertMessage: '',
            alertStatus: false,
            alertType: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            reenterPassword: '',
            matchPassword: false,
            validEmail: false,
            validForm: false,
            validPassword: false
        }
    },
    methods: {
        checkPasswords() {
            this.validatePassword();
            this.matchPasswords();
        },
        checkForm() {
            if (this.firstName && this.lastName && this.validEmail && this.validPassword) return true
            else return false
        },
        async signup() {
            if (this.checkForm()) {
                // Proxy should be used, but not be configured given the time frame
                /* eslint-disable */
                let response = await fetch('http://localhost:8080/api/users/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: this.email,
                            firstName: this.firstName,
                            lastName: this.lastName,
                            password: this.password
                        })
                    })
                    .then((res) => {
                        return res.json();
                    })
                    .then((json) => {
                        if (json.code == 201) {
                            // Set token
                            auth.setToken(json.token);

                            // Set success message
                            this.$refs.submit.disabled = true;
                            this.alertType = 'alert-success'
                            this.alertMessage = 'Account has been successfully created! Redirecting...';
                            this.alertStatus = true;

                            // Redirect
                            setTimeout(() => {
                                this.$router.push({
                                    path: '/status'
                                })
                            }, 2000);
                        }
                        else if (json.result == 'DUPLICATE ENTRY') {
                            this.alertType = 'alert-warning'
                            this.alertMessage = 'A user with the provided email already exists. Please provide another email.';
                            this.alertStatus = true;
                        }
                    })
                    .catch((err) => {
                        // Error handling
                        this.alertType = 'alert-warning'
                        this.alertMessage = 'An error while creating your account. Please contact customer support.';
                        this.alertStatus = true;
                    });
            }
        },
        matchPasswords() {
            let regex = new RegExp(this.password, "g");
            if (this.reenterPassword.match(regex)) {
                this.$refs.reenterPassword.classList.remove('is-invalid');
                this.$refs.reenterPassword.classList.add('is-valid');
                this.matchPassword = true;

            } else {
                this.$refs.reenterPassword.classList.remove('is-valid');
                this.$refs.reenterPassword.classList.add('is-invalid');
                this.matchPassword = false;
            }
        },
        validateEmail() {
            if (this.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                this.$refs.emailInput.classList.remove('is-invalid');
                this.$refs.emailInput.classList.add('is-valid');
                this.validEmail = true;
            } else {
                this.$refs.emailInput.classList.remove('is-valid');
                this.$refs.emailInput.classList.add('is-invalid');
                this.validEmail = false;
            }
        },
        validatePassword() {
            if (this.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
                this.$refs.password.classList.remove('is-invalid');
                this.$refs.password.classList.add('is-valid');
                this.validPassword = true;
            } else {
                this.$refs.password.classList.remove('is-valid');
                this.$refs.password.classList.add('is-invalid');
                this.validPassword = false;
            }
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
</style>