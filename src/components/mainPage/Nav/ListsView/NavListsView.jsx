//^3rd
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faPlus, faCircle, faAngleRight, faAngleLeft, faPencil, faSquareMinus } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'

//? Locale
import SmallSpinner from '../../../SmallSpinner'
import ErrorPage from '../../../ErrorPage'
import Portal from '../../../Portal'
import { fetchListsQueries } from '../../../../query/list'
import AddListForm from './AddListForm'
import UpdateListForm from "./UpdateListForm"
import DeleteListPrompt from './DeleteListPrompt';
export default function NavListsView() {
    //* Hooks
    const [listsCount, setListCount] = useState(0);
    const [lists, setLists] = useState([]);
    const [page, setPage] = useState(1);
    const [focusedList, setFocusedList] = useState({});

    //* Add List Form Modal Control
    const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);

    const openAddListModal = () => {
        setIsAddListModalOpen(true);
    };
    const closeAddListModal = () => {
        setIsAddListModalOpen(false);
    };

    //* Update List Form Modal Control
    const [isUpdateListModalOpen, setIsUpdateListModalOpen] = useState(false)

    const openUpdateListModal = () => {
        setIsUpdateListModalOpen(true);
    };
    const closeUpdaeListModal = () => {
        setIsUpdateListModalOpen(false);
    };

    //* Delete List Check Prompt Control
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const openDeleteListModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteListModal = () => {
        setIsDeleteModalOpen(false);
    };

    const [countQuery, listsQuery] = fetchListsQueries(page)

    //* Effect
    useEffect(() => {
        (async () => {
            if (countQuery.data) {
                setListCount(countQuery.data);
            }
            if (listsQuery.data) {
                setLists(listsQuery.data)
            }
        })();
    }, [listsQuery, countQuery, page]);



    //* Loading 
    if (countQuery.isLoading || listsQuery.isLoading) {
        return (<SmallSpinner />)
    }

    //* Error 
    if (countQuery.isError) {
        return (<ErrorPage message={countQuery.error.message} />)
    }
    if (listsQuery.isError) {
        return (<ErrorPage message={listsQuery.error.message} />)
    }

    //* Component
    return (
        <>
            {/* Checking The Modals State */}
            {
                isAddListModalOpen ? (
                    <Portal>
                        <AddListForm closeModal={closeAddListModal} />
                    </Portal>
                ) : null
            }
            {
                isUpdateListModalOpen && focusedList != {} ? (
                    <Portal>
                        <UpdateListForm list={focusedList} closeModal={closeUpdaeListModal} />
                    </Portal>
                ) : null
            }
            {
                isDeleteModalOpen && focusedList != {} ? (
                    <Portal>
                        <DeleteListPrompt list={focusedList} closeModal={closeDeleteListModal} />
                    </Portal>
                ) : null
            }

            {/* Heading */}
            <h3 className='font-semibold w-full flex justify-between'>Lists
                <span>
                    <button
                        className='m-1 px-2 py-1 bg-gray-300 rounded-md text-sm'
                        onClick={() => { openAddListModal() }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <span className='m-1 px-2 py-1 bg-gray-300 rounded-md '>{listsCount}</span>
                </span>
            </h3>

            {/* The Lists  */}
            <ul className='m-3 flex-col'>
                {
                    lists.map(list => {
                        return <li className='flex justify-between relative' key={list._id}>
                            <div className='m-1 px-1 py-0.5 w-9/12 hover:bg-gray-300 rounded-md duration-100'>
                                <FontAwesomeIcon icon={faSquare} className=' mr-4 ' style={{ color: list.color }} />
                                <Link to={`/app/lists/${list._id}`}>{list.heading}</Link>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faPencil} className=' cursor-pointer px-1 hover:text-yellow-400' onClick={() => { setFocusedList(list); openUpdateListModal() }} />
                                <FontAwesomeIcon icon={faSquareMinus} className=' cursor-pointer px-1 hover:text-yellow-400' onClick={() => { setFocusedList(list); openDeleteListModal() }} />
                            </div>
                        </li>
                    })
                }
            </ul>

            {/* Pagination Control  */}
            <div className='w-full text-center text-xs'>
                {Array.from({ length: Math.ceil(listsCount / 3) }, (_, index) => (
                    <FontAwesomeIcon key={index} icon={faCircle} className={index + 1 === page ? 'text-yellow-400 p-1' : 'text-gray-300 rounded-md p-1'} />
                ))}
            </div>

            <div className='flex justify-evenly'>
                {
                    !listsQuery.isFetching ? (
                        <>
                            <button
                                className='h-full w-10 bg-gray-300 rounded-md hover:bg-gray-400 duration-200 disabled:opacity-30'
                                onClick={() => { setPage(page - 1); listsQuery.refetch(); }}
                                disabled={page === 1} >
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </button>

                            <button
                                className='h-full w-10 bg-gray-300 rounded-md hover:bg-gray-400 duration-200 disabled:opacity-30'
                                onClick={() => { setPage(page + 1); listsQuery.refetch(); }}
                                disabled={page >= Math.ceil(listsCount / 3)}>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </button>
                        </>
                    ) : <ThreeDots
                        height="50"
                        width="50"
                        radius="9"
                        color="#facc15"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClassName=""
                        visible={true}
                    />
                }
            </div >
        </>
    )
}