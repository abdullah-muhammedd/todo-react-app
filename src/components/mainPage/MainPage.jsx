// ^ 3RD
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

//? Locale
import Nav from './Nav/Nav'
import { userReducer } from "../../slices/userSlice"
import StickyWall from '../stickyWall/StickyWall';
import Inbox from '../Tasks/Inbox';
import Upcomming from '../Tasks/Upcomming';
import { Route, Routes } from 'react-router-dom';
import Today from '../Tasks/Today';
import TasksByList from '../Tasks/ByList';
import TasksByTag from '../Tasks/ByTag';
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
            <div className='flex'>
                <Nav />
                <Routes>
                    <Route path="/sticky-wall" element={<StickyWall />} />
                    <Route path="/inbox" element={<Inbox />} />
                    <Route path="/upcomming" element={<Upcomming />} />
                    <Route path="/today" element={<Today />} />
                    <Route path="/by-list" element={<TasksByList />} />
                    <Route path="/by-tag" element={<TasksByTag />} />
                </Routes>
            </div>
        </>
    )

}

export default MainPage