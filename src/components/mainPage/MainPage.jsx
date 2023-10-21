// ^ 3RD
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

//? Locale
import Nav from './Nav/Nav'
import { userReducer } from "../../slices/userSlice"
import StickyWall from '../stickyWall/StickyWall';
import Inbox from '../Tasks/Inbox';
import { Route, Routes } from 'react-router-dom';
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
            <div className='flex'>
                <Nav />
                <Routes>
                    <Route path="/sticky-wall" element={<StickyWall />} />
                    <Route path="/inbox" element={<Inbox />} />
                </Routes>
            </div>
            {/* The Main View Component */}
            {/* The Tooggler right bar  */}
        </>
    )

}

export default MainPage