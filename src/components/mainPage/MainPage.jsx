// ^ 3RD
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

//? Locale
import Nav from './Nav/Nav'
import { userReducer } from "../../slices/userSlice"

function MainPage() {
    // * Hooks
    const isLoggedIn = userReducer.getState().loggedIn
    const navigate = useNavigate()
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [])

    // * Component
    return (
        <>
            {/* The Left Navbar */}
            <Nav />
            {/* The Main View Component */}
            {/* The Tooggler right bar  */}
        </>
    )

}

export default MainPage