export default {
    getToken() {
        return localStorage.token;
    },
    async getUser(token) {
        // Proxy should be used, but not be configured given the time frame
        /* eslint-disable */
        let user = {};
        let response = await fetch('http://localhost:8080/api/auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token
                })
            })
            .then((res) => {
                // Returned json response
                return res.json();
            })
            .then((json) => {
                if (json.code == 200) {
                    // Return user object
                    user = json.user;
                }
                else {
                    // Return null if user is not retrieved
                    user = null;
                }
            })
            .catch((err) => {
                // Return null if error occurs
                user = null;
            });

        return user;
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