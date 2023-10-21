// ^ 3RD
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOut } from '@fortawesome/free-solid-svg-icons';

//? Locale
import { userReducer, loggedOut } from '../../../slices/userSlice';
import NavTasksView from './NavTasksView';
import NavListsView from './ListsView/NavListsView';
import NavTagsView from './NavTagsView';
import Divider from './Divider';
import { getLogout } from "../../../client/auth"



export default function Nav() {
    // * Hooks
    const [bar, setBar] = useState(false);
    const navigate = useNavigate();

    // * Handlers
    const toggleSidebar = (ev) => {
        ev.preventDefault();
        setBar(!bar);
    };

    const handleLogout = async () => {
        await getLogout()
        userReducer.dispatch(loggedOut());
        navigate("/login")
    };

    // * Component
    return (
        <div style={bar ? {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            zIndex: 1000, // Ensure the modal is on top
        } : null}>
            <nav className={`bg-gray-100 duration-200  ${bar ? "w-72 h-5/6" : " w-16 h-16"} my-3 ml-3 mr-6 p-6 rounded-lg text-gray-700 absolute left-0 top-0 z-50`}>
                <div className='flex justify-between mb-6'>
                    <FontAwesomeIcon
                        onClick={toggleSidebar}
                        className={`text-xl duration-200 transform ${bar ? 'rotate-90' : ''} cursor-pointer`}
                        icon={faBars}
                    />
                    {bar ? <h2 className='text-2xl font-semibold'>Menu</h2> : null}
                </div>
                <div className={`nav-content ${bar ? 'active' : ''} `} >
                    <NavTasksView />
                    <Divider />
                    <NavListsView />
                    <Divider />
                    <NavTagsView />
                    <Divider />
                    <button className={`text-xl duration-200 transform`} onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOut} className={`${bar ? 'mr-2' : ''}`} />
                        {bar ? 'Sign Out' : ''}
                    </button>
                </div>
            </nav >
        </div>
    );
}
