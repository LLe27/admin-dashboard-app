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
                    this.user = json.user;
                } else; {
                    // Delete token and log user out with error
                }
            })
            .catch((err) => {
                // Delete token and log user out with error
                console.log(err);
            });

        return this.user;
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