import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
export default function NavTagsView() {
    return (
        <>
            <h3 className='font-semibold'>Tags</h3>
            <ul className='m-3 flex flex-wrap'>
                <li className='m-1 px-2 py-1 bg-blue-300 rounded-md '><a href="">Tag 1</a></li>
                <li className='m-1 px-2 py-1 bg-red-300 rounded-md '><a href="">Tag 2</a></li>
                <li className='m-1 px-2 py-1 bg-orange-300 rounded-md '><a href="">Tag 3</a></li>
            </ul>
            <button className='m-1 px-2 py-1 bg-gray-300 rounded-md ' ><FontAwesomeIcon icon={faPlus} />Add Tag</button>
        </>
    )
}