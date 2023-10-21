import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight, faCalendarDay, faNoteSticky, faInbox } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
export default function NavTasksView() {
    return (
        <>
            <h3 className='font-semibold'>Tasks</h3>
            <ul className='m-3 flex-col'>
                <li className='m-1'><Link to="/app/inbox"><FontAwesomeIcon icon={faInbox} className=' mr-4' />Inbox</Link></li>
                <li className='m-1'><a href=""><FontAwesomeIcon icon={faAnglesRight} className=' mr-4' />Upcomming</a></li>
                <li className='m-1'><a href=""><FontAwesomeIcon icon={faCalendarDay} className=' mr-4' />Today</a></li>
                <li className='m-1'><Link to="/app/sticky-wall"><FontAwesomeIcon icon={faNoteSticky} className=' mr-4' />Sticky Wall</Link></li>
            </ul>
        </>
    )
}