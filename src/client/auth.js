import axios from "axios";
async function postSignup(userData) {
    try {
        const response = await axios.post(
            "http://localhost:3030/api/v1/signup",
            userData,
            {
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                },
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        )
        return response;
    } catch (error) {
        throw error
    }
}

async function postLogin(userData) {
    try {
        const response = await axios.post(
            "http://localhost:3030/api/v1/login",
            userData,
            {
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                },
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        )
        return response;
    } catch (error) {
        throw error
    }
}

async function getLogout() {
    const res = await fetch(
        " http://localhost:3030/api/v1/logout",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        }
    );
    return res.json();
}
export {
    postSignup,
    postLogin,
    getLogout
}