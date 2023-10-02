import axios from "axios";

async function getNotes(page = 1, perPage = 9) {
    try {
        const response = await axios.get("http://localhost:3030/api/v1/notes", {
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

async function getNotesCount() {
    try {
        const response = await axios.get("http://localhost:3030/api/v1/notes/count", {
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

async function postNote(NoteData) {
    try {
        const response = await axios.post(
            "http://localhost:3030/api/v1/notes",
            NoteData,
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

async function patchNote(NoteData, noteID) {
    try {
        const response = await axios.patch(
            `http://localhost:3030/api/v1/notes/${noteID}`,
            NoteData,
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

async function deleteNote(noteID) {
    try {
        const response = await axios.delete(
            `http://localhost:3030/api/v1/notes/${noteID}`,
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
    getNotes,
    getNotesCount,
    postNote,
    patchNote,
    deleteNote
}