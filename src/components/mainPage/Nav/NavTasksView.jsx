import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight, faCalendarDay, faNoteSticky, } from '@fortawesome/free-solid-svg-icons'
export default function NavTasksView() {
    return (
        <>
            <h3 className='font-semibold'>Tasks</h3>
            <ul className='m-3 flex-col'>
                <li className='m-1'><a href=""><FontAwesomeIcon icon={faAnglesRight} className=' mr-4' />Upcomming</a></li>
                <li className='m-1'><a href=""><FontAwesomeIcon icon={faCalendarDay} className=' mr-4' />Today</a></li>
                <li className='m-1'><a href=""><FontAwesomeIcon icon={faNoteSticky} className=' mr-4' />Sticky Wall</a></li>
            </ul>
        </>
    )
}