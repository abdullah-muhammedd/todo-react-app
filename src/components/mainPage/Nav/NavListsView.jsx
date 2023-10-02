//^3rd
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faPlus, faCircle, faAngleRight, faAngleLeft, faX, faPencil, faSquareMinus } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query'
import { ThreeDots } from 'react-loader-spinner'
import { useFormik } from 'formik';
import * as Yup from 'yup';

//? Locale
import FormErrorArea from '../../FormErrorArea'
import LoadingSpinner from '../../LoadingSpinner'
import SmallSpinner from '../../SmallSpinner'
import ErrorPage from '../../ErrorPage'
import Portal from '../../Portal'
import { getLists, getListsCount, postList, patchList, deleteList } from '../../../client/lists'

//& The Main Component 
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

    //* Queries 
    const queries = useQueries({
        queries: [
            {
                queryKey: ["listsCount"],
                queryFn: async () => {
                    const response = await getListsCount();
                    return response.count;
                },
                staleTime: 5 * 60 * 1000
            },
            {
                queryKey: ["lists", page],
                queryFn: async () => {
                    const response = await getLists(page, 3);
                    return response.lists;
                },
                keepPreviousData: true,
                staleTime: 5 * 60 * 1000
            }]
    })
    const [countQuery, listsQuery] = queries

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

//& Adding List Modal Component 
function AddListForm({ closeModal }) {
    // * Hooks
    let queryClient = useQueryClient();
    let [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    // * Validation Schema
    const Schema = Yup.object({
        heading: Yup.string().trim().required("Heading Is Required"),
        color: Yup.string().trim().default("#00FF00")
            .matches(/^#[a-fA-F0-9]{6}$/, 'Invalid Hexadecimal Color')
    })

    // * Mutation
    const addingListMutation = useMutation({
        mutationFn: async (listData) => {
            const response = await postList(listData);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["lists"])
            queryClient.invalidateQueries(["listsCount"])
            navigate(-1)
        }
    });

    // * Formik
    const {
        handleSubmit,
        handleChange,
        handleBlur,
        touched,
        values,
        errors,
    } = useFormik({
        initialValues: {
            heading: "",
            color: "#00FF00",
        },
        validationSchema: Schema,
        onSubmit: async (values) => {
            let listData = values;
            const result = await addingListMutation.mutateAsync(listData)
            if (result.error) {
                setApiError(result.error.message);
            }
        },
    });

    //* Loading 
    if (addingListMutation.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (addingListMutation.isError) {
        return (<ErrorPage message={addingListMutation.error.message} />)
    }


    //* Component 
    return (
        <>
            <div className='flex justify-center'>
                <div className='h-screen w-screen p-5 flex justify-center items-center '>
                    <form
                        onSubmit={handleSubmit}
                        className=' relative flex flex-col justify-center items-center md:h-6/12 md:w-6/12 p-5 bg-gray-100 rounded-md'>
                        <FontAwesomeIcon icon={faX}
                            className=' absolute top-5 right-5 cursor-pointer hover:text-yellow-400 duration-200 text-lg'
                            onClick={() => closeModal()} />
                        <h2 className='text-4xl mb-5 font-semibold'>Add List</h2>
                        <FormErrorArea condition={apiError} message={apiError} />

                        <input
                            type="text"
                            id='heading'
                            name='heading'
                            className='form-input'
                            placeholder='Heading'
                            onChange={handleChange}
                            onBlur={handleBlur} />
                        <FormErrorArea condition={touched.heading && errors.heading} message={errors.heading} />

                        <input
                            type="color"
                            id='color'
                            name='color'
                            className='form-input'
                            placeholder='Color'
                            value="#00FF00"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <FormErrorArea condition={touched.color && errors.color} message={errors.color} />
                        <button type='submit' className='form-button'>Add</button>
                    </form>
                </div>
            </div >
        </>
    )
}

//& Updating List Modal Component
function UpdateListForm({ list, closeModal }) {
    // * Hooks
    let queryClient = useQueryClient();
    let [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    // * Validation Schema
    const Schema = Yup.object({
        heading: Yup.string().trim().required("Heading Is Required"),
        color: Yup.string().trim().default("#00FF00")
            .matches(/^#[a-fA-F0-9]{6}$/, 'Invalid Hexadecimal Color')
    })

    // * Mutation
    const updatingListMutation = useMutation({
        mutationFn: async (listData) => {
            const response = await patchList(listData, list._id);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["lists"])
            queryClient.invalidateQueries(["listsCount"])
            navigate(-1)
        }
    });

    // * Formik
    const {
        handleSubmit,
        handleChange,
        handleBlur,
        touched,
        values,
        errors,
    } = useFormik({
        initialValues: {
            heading: list.heading,
            color: list.color,
        },
        validationSchema: Schema,
        onSubmit: async (values) => {
            let listData = values;
            const result = await updatingListMutation.mutateAsync(listData)
            if (result.error) {
                setApiError(result.error.message);
            }
        },

    });

    //* Loading 
    if (updatingListMutation.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (updatingListMutation.isError) {
        return (<ErrorPage message={updatingListMutation.error.message} />)
    }

    //* Component 
    return (
        <>
            <div className='flex justify-center'>
                <div
                    className='h-screen w-screen p-5 flex justify-center items-center '>
                    <form
                        onSubmit={handleSubmit}
                        className=' relative flex flex-col justify-center items-center md:h-6/12 md:w-6/12 p-5 bg-gray-100 rounded-md'>
                        <FontAwesomeIcon icon={faX}
                            className=' absolute top-5 right-5 cursor-pointer hover:text-yellow-400 duration-200 text-lg'
                            onClick={() => closeModal()} />
                        <h2 className='text-4xl mb-5 font-semibold'>Update List</h2>
                        <FormErrorArea condition={apiError} message={apiError} />

                        <input
                            type="text"
                            id='heading'
                            name='heading'
                            className='form-input'
                            placeholder='Heading'
                            value={list.heading}
                            onChange={handleChange}
                            onBlur={handleBlur} />
                        <FormErrorArea condition={touched.heading && errors.heading} message={errors.heading} />

                        <input
                            type="color"
                            id='color'
                            name='color'
                            className='form-input'
                            placeholder='Color'
                            value={list.color}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <FormErrorArea condition={touched.color && errors.color} message={errors.color} />
                        <button type='submit' className='form-button'>Update</button>
                    </form>
                </div>
            </div >
        </>
    )
}

function DeleteListPrompt({ list, closeModal }) {
    // * Hooks
    let queryClient = useQueryClient();
    let [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    // * Mutation
    const deletingListMutation = useMutation({
        mutationFn: async () => {
            const response = await deleteList(list._id);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["lists"])
            queryClient.invalidateQueries(["listsCount"])
            navigate(-1)
        }
    });
    // * Handlers
    async function Yes() {
        const result = await deletingListMutation.mutateAsync(list._id)
        if (result.error) {
            setApiError(result.error.message);
        }
    }

    function No() {
        navigate(-1);
    }

    //* Loading 
    if (deletingListMutation.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (deletingListMutation.isError) {
        return (<ErrorPage message={deletingListMutation.error.message} />)
    }


    //* Component 
    return (
        <>
            <div className='flex justify-center'>
                <div className='h-screen w-screen p-5 flex justify-center items-center '>
                    <div
                        className=' relative flex flex-col justify-center items-center md:h-6/12 md:w-6/12 h-10/12 w-10/12 p-5 bg-gray-100 rounded-md'>
                        <FontAwesomeIcon icon={faX}
                            className=' absolute top-5 right-5 cursor-pointer hover:text-yellow-400 duration-200 text-lg'
                            onClick={() => closeModal()} />
                        <h2 className='text-4xl mb-5 font-semibold'>Delete List</h2>
                        <FormErrorArea condition={apiError} message={apiError} />
                        <p className='text-center text-xl my-2'>Are you sure you want to delete this list? the related task will stay but they will lost the list field </p>
                        <div className='flex'>
                            <button className='form-button md:w-48 w-32' onClick={() => Yes()}>Yes</button>
                            <button className='form-button md:w-48 w-32' onClick={() => No()}>No</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}