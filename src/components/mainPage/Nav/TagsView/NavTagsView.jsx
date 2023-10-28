//^3rd
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCircle, faAngleRight, faAngleLeft, faX, faPencil, faSquareMinus, faStar } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'


//? Locale
import SmallSpinner from '../../../SmallSpinner'
import ErrorPage from '../../../ErrorPage'
import Portal from '../../../Portal'
import { fetchTagsQueries } from '../../../../query/tag'
import AddTagForm from './AddTagForm';
import UpdateTagForm from './UpdateTagForm';
import DeleteTagPrompt from './DeleteTagPrompt';

//& The Main Component 
export default function NavTagsView() {
    //* Hooks
    const [tagsCount, setTagsCount] = useState(0);
    const [tags, setTags] = useState([]);
    const [page, setPage] = useState(1);
    const [focusedTag, setFocusedTag] = useState({});

    //* Add Tag Form Modal Control
    const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);

    const openAddTagModal = () => {
        setIsAddTagModalOpen(true);
    };
    const closeAddTagModal = () => {
        setIsAddTagModalOpen(false);
    };

    //* Update Tag Form Modal Control
    const [isUpdateTagModalOpen, setIsUpdateTagModalOpen] = useState(false)

    const openUpdateTagModal = () => {
        setIsUpdateTagModalOpen(true);
    };
    const closeUpdaeTagModal = () => {
        setIsUpdateTagModalOpen(false);
    };

    //* Delete Tag Check Prompt Control
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const openDeleteTagModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteTagModal = () => {
        setIsDeleteModalOpen(false);
    };

    //* Queries 
    const [countQuery, tagsQuery] = fetchTagsQueries(page)

    //* Effect
    useEffect(() => {
        (async () => {
            if (countQuery.data) {
                setTagsCount(countQuery.data);
            }
            if (tagsQuery.data) {
                setTags(tagsQuery.data)
            }
        })();
    }, [tagsQuery, countQuery, page]);


    //* Loading 
    if (countQuery.isLoading || tagsQuery.isLoading) {
        return (<SmallSpinner />)
    }

    //* Error 
    if (countQuery.isError) {
        return (<ErrorPage message={countQuery.error.message} />)
    }
    if (tagsQuery.isError) {
        return (<ErrorPage message={tagsQuery.error.message} />)
    }

    //* Component
    return (
        <>
            {/* Checking The Modals State */}
            {
                isAddTagModalOpen ? (
                    <Portal>
                        <AddTagForm closeModal={closeAddTagModal} />
                    </Portal>
                ) : null
            }
            {
                isUpdateTagModalOpen && focusedTag != {} ? (
                    <Portal>
                        <UpdateTagForm tag={focusedTag} closeModal={closeUpdaeTagModal} />
                    </Portal>
                ) : null
            }
            {
                isDeleteModalOpen && focusedTag != {} ? (
                    <Portal>
                        <DeleteTagPrompt tag={focusedTag} closeModal={closeDeleteTagModal} />
                    </Portal>
                ) : null
            }

            {/* Heading */}
            <h3 className='font-semibold w-full flex justify-between'>Tags
                <span>
                    <button
                        className='m-1 px-2 py-1 bg-gray-300 rounded-md text-sm'
                        onClick={() => { openAddTagModal() }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <span className='m-1 px-2 py-1 bg-gray-300 rounded-md '>{tagsCount}</span>
                </span>
            </h3>

            {/* The Tags  */}
            <ul className='m-3 flex-col'>
                {
                    tags.map(tag => {
                        return <li className='flex justify-between relative' key={tag._id}>
                            <div className='m-1 px-1 py-0.5 w-9/12 hover:bg-gray-300 rounded-md duration-100'>
                                <FontAwesomeIcon icon={faStar} className=' mr-4 ' style={{ color: tag.color }} />
                                <Link to={`/app/by-tag?id=${tag._id}&heading=${tag.heading}`}  >{tag.heading}</Link>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faPencil} className=' cursor-pointer px-1 hover:text-yellow-400' onClick={() => { setFocusedTag(tag); openUpdateTagModal() }} />
                                <FontAwesomeIcon icon={faSquareMinus} className=' cursor-pointer px-1 hover:text-yellow-400' onClick={() => { setFocusedTag(tag); openDeleteTagModal() }} />
                            </div>
                        </li>
                    })
                }
            </ul>

            {/* Pagination Control  */}
            <div className='w-full text-center text-xs'>
                {Array.from({ length: Math.ceil(tagsCount / 3) }, (_, index) => (
                    <FontAwesomeIcon key={index} icon={faCircle} className={index + 1 === page ? 'text-yellow-400 p-1' : 'text-gray-300 rounded-md p-1'} />
                ))}
            </div>

            <div className='flex justify-evenly'>
                {
                    !tagsQuery.isFetching ? (
                        <>
                            <button
                                className='h-full w-10 bg-gray-300 rounded-md hover:bg-gray-400 duration-200 disabled:opacity-30'
                                onClick={() => { setPage(page - 1); tagsQuery.refetch(); }}
                                disabled={page === 1} >
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </button>

                            <button
                                className='h-full w-10 bg-gray-300 rounded-md hover:bg-gray-400 duration-200 disabled:opacity-30'
                                onClick={() => { setPage(page + 1); tagsQuery.refetch(); }}
                                disabled={page >= Math.ceil(tagsCount / 3)}>
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




