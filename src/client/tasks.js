import axios from "axios";
import moment from "moment";
async function getAllTasks(page = 1, perPage = 20) {
    try {
        const response = await axios.get("http://localhost:3030/api/v1/tasks", {
            params: {
                page,
                perPage,
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

async function getTasksUpcomming(page = 1, perPage = 20) {
    const dueDateFrom =  moment(new Date(Date.now())).format('YYYY-MM-DD').toString();
    try {
        const response = await axios.get("http://localhost:3030/api/v1/tasks", {
            params: {
                page,
                perPage,
                done: false,
                dueDateFrom: dueDateFrom
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
async function getTasksToday(page = 1, perPage = 20) {
    const dueDateFrom =  moment(new Date(Date.now())).format('YYYY-MM-DD').toString();
    const dueDateTo = moment(new Date(Date.now())).add("day").format('YYYY-MM-DD');
    try {
        const response = await axios.get("http://localhost:3030/api/v1/tasks", {
            params: {
                page,
                perPage,
                done: false,
                dueDateFrom: dueDateFrom,
                dueDateTo:dueDateTo
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
async function getTasksByList(listID , page = 1, perPage = 20) {
    try {
        const response = await axios.get(`http://localhost:3030/api/v1/tasks/lists/${listID}`, {
        params: {
            page,
            perPage,
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
async function getTasksByTag(tagID , page = 1, perPage = 20) {
    try {
        const response = await axios.get(`http://localhost:3030/api/v1/tasks/tags/${tagID}`, {
        params: {
            page,
            perPage,
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

export {
    getAllTasks,
    getTasksDone,
    postTask,
    patchTask,
    deleteTask,
    toggleTaskDone,
    getTasksUpcomming,
    getTasksToday,
    getTasksByList,
    getTasksByTag
}