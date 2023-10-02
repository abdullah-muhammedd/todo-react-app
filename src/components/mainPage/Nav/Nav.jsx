// ^ 3RD
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOut } from '@fortawesome/free-solid-svg-icons';

//? Locale
import { userReducer, loggedOut } from '../../../slices/userSlice';
import NavTasksView from './NavTasksView';
import NavListsView from './NavListsView';
import NavTagsView from './NavTagsView';
import Divider from './Divider';
import { getLogout } from "../../../client/auth"


export default function Nav() {
    // * Hooks
    const [bar, setBar] = useState(true);
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
        <nav className="bg-gray-100 w-72 m-6 p-6 rounded-lg text-gray-700 h-fit relative">
            <div className='flex justify-between mb-6'>
                <FontAwesomeIcon
                    onClick={toggleSidebar}
                    className={`text-xl duration-500 transform ${bar ? 'rotate-90' : ''} cursor-pointer`}
                    icon={faBars}
                />
                <h2 className='text-2xl font-semibold'>Menu</h2>
            </div>
            <div className={`nav-content ${bar ? 'active' : ''}`}>
                <NavTasksView />
                <Divider />
                <NavListsView />
                <Divider />
                <NavTagsView />
                <Divider />
            </div>
            <div className='mt-0 flex p-1 flex-wrap font-semibold w-52'>
                <button className={bar ? 'mt-4' : ''} onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOut} className='mr-4 text-2xl' />
                    {bar ? 'Sign Out' : ''}
                </button>
            </div>
        </nav>
    );
}
