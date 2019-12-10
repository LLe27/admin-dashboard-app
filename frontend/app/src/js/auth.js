import jwt from 'jsonwebtoken';

export default {
    getToken() {
        return localStorage.token;
    },
    getUser() {
        return jwt.verify(localStorage.token, 'supersecretpassword');
    },
    loggedIn() {
        if (localStorage.getItem('token')) {
            return true;
        } else {
            return false;
        }
    },
    logout() {
        localStorage.clear();
    },
    setToken(token) {
        localStorage.setItem('token', token);
    }
}