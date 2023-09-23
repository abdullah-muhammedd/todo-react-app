async function postSignup(userData) {
    const res = await fetch(
        " http://localhost:3030/api/v1/signup",
        {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        }
    );
    return res.json();
}

async function postLogin(userData) {
    const res = await fetch(
        " http://localhost:3030/api/v1/login",
        {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        }
    );
    return res.json();
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