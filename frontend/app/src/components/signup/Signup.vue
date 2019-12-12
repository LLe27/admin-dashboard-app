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
                <input ref="emailInput" v-model="email" type="text" class="form-control" id="emailInput"
                    aria-describedby="loginInput" @input="handleEmailInput()">
                <small v-if="invalidEmail" class="text-danger">Please enter a valid email address.</small>
            </div>
            <div class="form-group">
                <label for="firstNameInput">First name</label>
                <input ref="firstNameInput" v-model="firstName" type="text" class="form-control" id="firstNameInput"
                    aria-describedby="loginInput" @input="handleFirstName()">
                <small v-if="invalidFirstName" class="text-danger">Please enter a first name.</small>
            </div>
            <div class="form-group">
                <label for="lastNameInput">Last name</label>
                <input ref="lastNameInput" v-model="lastName" type="text" class="form-control" id="lastNameInput"
                    aria-describedby="loginInput" @input="handleLastName()">
                <small v-if="invalidLastName" class="text-danger">Please enter a last name.</small>
            </div>
            <div class="form-group">
                <label for="passwordInput">Password</label>
                <input ref="passwordInput" v-model="password" type="password" class="form-control" id="passwordInput"
                    maxlength="20">
                <small v-if="invalidPassword" class="text-danger">Please a password between 6 to 20 characters which
                    contain at least one numeric digit, one uppercase and one lowercase letter.</small>
            </div>
            <div class="form-group">
                <label for="reenterPasswordInput">Re-enter Password</label>
                <input ref="reenterPassword" v-model="reenterPassword" type="password" class="form-control"
                    maxlength="20" id="reenterPasswordInput">
                <small v-if="invalidMatch" class="text-danger">Please re-enter the password provided. Passwords must
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
            invalidEmail: false,
            invalidFirstName: false,
            invalidLastName: false,
            invalidMatch: false,
            invalidPassword: false
        }
    },
    methods: {
        checkForm() {
            if (!this.invalidEmail && !this.invalidFirstName && !this.invalidLastName && !this.invalidPassword && !this.invalidMatch) return true
            else return false
        },
        handleEmailInput() {
            let validEmail = this.email

            // Remove all whitespaces
            validEmail = validEmail.replace(/\s/g, '');
            this.email = validEmail;
        },
        handleFirstName() {
            let validFirstname = this.firstName

            // Remove all whitespaces
            validFirstname = validFirstname.trim();
            validFirstname = validFirstname.replace(/[^a-zA-Z]/g,'');
            this.firstName = validFirstname;
        },
        handleLastName() {
            let validLastName = this.validLastName

            // Remove all whitespaces
            validLastName = validLastName.trim();
            validLastName = validLastName.replace(/[^a-zA-Z]/g,'');
            this.lastName = validLastName;
        },
        async signup() {
            // Validate form
            this.validateEmail();
            this.validateFirstName();
            this.validateLastName();
            this.validatePassword();
            this.matchPasswords();

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
                                    path: '/'
                                })
                            }, 2000);
                        } else if (json.result == 'DUPLICATE ENTRY') {
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
            if (this.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/) && this.reenterPassword.match(regex)) {
                this.invalidMatch = false;
                this.$refs.reenterPassword.classList.add('is-valid');
                this.$refs.reenterPassword.classList.remove('is-invalid');

            } else {
                this.invalidMatch = true;
                this.$refs.reenterPassword.classList.add('is-invalid');
                this.$refs.reenterPassword.classList.remove('is-valid');
            }
        },
        validateEmail() {
            // Validate email format
            if (this.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                this.invalidEmail = false;
                this.$refs.emailInput.classList.add('is-valid');
                this.$refs.emailInput.classList.remove('is-invalid');
            } else {
                this.invalidEmail = true;
                this.$refs.emailInput.classList.add('is-invalid');
                this.$refs.emailInput.classList.remove('is-valid');
            }
        },
        validateFirstName() {
            // Validate first name format
            if (this.firstName.match(/\w+$/)) {
                this.invalidFirstName = false;
                this.$refs.firstNameInput.classList.add('is-valid');
                this.$refs.firstNameInput.classList.remove('is-invalid');
            } else {
                this.invalidFirstName = true;
                this.$refs.firstNameInput.classList.add('is-invalid');
                this.$refs.firstNameInput.classList.remove('is-valid');
            }
        },
        validateLastName() {
            // Validate first name format
            if (this.lastName.match(/\w+$/)) {
                this.invalidLastName = false;
                this.$refs.lastNameInput.classList.add('is-valid');
                this.$refs.lastNameInput.classList.remove('is-invalid');
            } else {
                this.invalidLastName = true;
                this.$refs.lastNameInput.classList.add('is-invalid');
                this.$refs.lastNameInput.classList.remove('is-valid');
            }
        },
        validatePassword() {
            // Validate password format
            if (this.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
                this.invalidPassword = false;
                this.$refs.passwordInput.classList.add('is-valid');
                this.$refs.passwordInput.classList.remove('is-invalid');
            } else {
                this.invalidPassword = true;
                this.$refs.passwordInput.classList.add('is-invalid');
                this.$refs.passwordInput.classList.remove('is-valid');
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