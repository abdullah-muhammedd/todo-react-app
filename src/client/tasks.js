import axios from "axios";

async function getTasksNonDone(page = 1, perPage = 20) {
    try {
        const response = await axios.get("http://localhost:3030/api/v1/tasks", {
            params: {
                page,
                perPage,
                done: "false"
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
async function getTasksDone(page = 1, perPage = 20) {
    try {
        const response = await axios.get("http://localhost:3030/api/v1/tasks", {
            params: {
                page,
                perPage,
                done: true
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

async function getTasksCount() {
    try {
        const response = await axios.get("http://localhost:3030/api/v1/tasks/count", {
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

async function postTask(taskData) {
    try {
        const response = await axios.post(
            "http://localhost:3030/api/v1/tasks",
            taskData,
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

async function patchTask(taskData, taskID) {
    try {
        const response = await axios.patch(
            `http://localhost:3030/api/v1/tasks/${taskID}`,
            taskData,
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
async function toggleTaskDone(taskID) {
    try {
        const response = await axios.patch(
            `http://localhost:3030/api/v1/tasks/${taskID}/toggle-done`,
            {},
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
async function deleteTask(taskID) {
    try {
        const response = await axios.delete(
            `http://localhost:3030/api/v1/tasks/${taskID}`,
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
    getTasksNonDone,
    getTasksDone,
    postTask,
    patchTask,
    deleteTask,
    toggleTaskDone
}