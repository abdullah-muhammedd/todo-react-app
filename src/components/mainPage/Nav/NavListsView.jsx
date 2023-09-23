import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faPlus, } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
export default function NavListsView() {
    return (
        <>
            <h3 className='font-semibold'>Lists</h3>
            <ul className='m-3 flex-col'>
                <li className='m-1'><Link to="/app/lists/"><FontAwesomeIcon icon={faSquare} className=' mr-4' />List 1 </Link></li>
                <li className='m-1'><a href=""><FontAwesomeIcon icon={faSquare} className=' mr-4' />List 2</a></li>
                <li className='m-1'><a href=""><FontAwesomeIcon icon={faSquare} className=' mr-4' />List 3</a></li>
            </ul>
            <button className='m-1 px-2 py-1 bg-gray-300 rounded-md ' ><FontAwesomeIcon icon={faPlus} />Add List</button>
        </>
    )
}