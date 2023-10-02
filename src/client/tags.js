import axios from "axios";

async function getTags(page = 1, perPage = 3) {
    try {
        const response = await axios.get("http://localhost:3030/api/v1/tags", {
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

async function getTagsCount() {
    try {
        const response = await axios.get("http://localhost:3030/api/v1/tags/count", {
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

async function postTag(tagData) {
    try {
        const response = await axios.post(
            "http://localhost:3030/api/v1/tags",
            tagData,
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

async function patchTag(tagData, tagID) {
    try {
        const response = await axios.patch(
            `http://localhost:3030/api/v1/tags/${tagID}`,
            tagData,
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

async function deleteTag(tagID) {
    try {
        const response = await axios.delete(
            `http://localhost:3030/api/v1/tags/${tagID}`,
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
    getTags,
    getTagsCount,
    postTag,
    patchTag,
    deleteTag
}