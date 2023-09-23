
import { createSlice, configureStore } from '@reduxjs/toolkit'
import Cookies from "js-cookie"

//*  Creating the reducer
const userSlice = createSlice({
    name: 'user',
    initialState: {
        loggedIn: false
    },
    reducers: {
        loggedIn: state => {
            state.loggedIn = true
        },
        loggedOut: state => {
            state.loggedIn = false
        }
    }
})

const { loggedIn, loggedOut } = userSlice.actions


//* Retrieve the state from local storage
let persistedState = localStorage.getItem('userState')
    ? JSON.parse(localStorage.getItem('userState'))
    : userSlice.initial;

// Validate The Stored State Against The current User State According to the cookies 
if (!Cookies.get('tokens_existed') || Cookies.get('tokens_existed') === "false") {
    persistedState = {
        ...persistedState,
        loggedIn: false
    };
    localStorage.setItem('userState', JSON.stringify(persistedState));
}
else {
    persistedState = {
        ...persistedState,
        loggedIn: true
    };
    localStorage.setItem('userState', JSON.stringify(persistedState));
}


//* Create the Redux store with preloaded state
const store = configureStore({
    reducer: userSlice.reducer,
    preloadedState: persistedState,
});


//* Subscribe to store changes and save state to local storage
store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem('userState', JSON.stringify(state));
});

export {
    store as userReducer,
    loggedIn,
    loggedOut
}