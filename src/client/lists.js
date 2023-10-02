import axios from "axios";

async function getLists(page = 1, perPage = 3) {
    try {
        const response = await axios.get("http://localhost:3030/api/v1/lists", {
            params: {
                page,
                perPage
            },
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            },
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        })
        return response.data;
    } catch (error) {
        throw error
    }
}

async function getListsCount() {
    try {
        const response = await axios.get("http://localhost:3030/api/v1/lists/count", {
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            },
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        })
        return response.data;
    } catch (error) {
        throw error
    }
}

async function postList(listData) {
    try {
        const response = await axios.post(
            "http://localhost:3030/api/v1/lists",
            listData,
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
        return response.data;
    } catch (error) {
        throw error
    }
}

async function patchList(listData, listID) {
    try {
        const response = await axios.patch(
            `http://localhost:3030/api/v1/lists/${listID}`,
            listData,
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
        return response.data;
    } catch (error) {
        throw error
    }
}

async function deleteList(listID) {
    try {
        const response = await axios.delete(
            `http://localhost:3030/api/v1/lists/${listID}`,
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
        return response.data;
    } catch (error) {
        throw error
    }
}
export {
    getLists,
    getListsCount,
    postList,
    patchList,
    deleteList
}