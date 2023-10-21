//^3rd
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faPlus, faCircle, faAngleRight, faAngleLeft, faX, faPencil, faSquareMinus, faStar } from '@fortawesome/free-solid-svg-icons'
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
import { getTags, getTagsCount, postTag, patchTag, deleteTag } from '../../../client/tags'

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
    const queries = useQueries({
        queries: [
            {
                queryKey: ["tagsCount"],
                queryFn: async () => {
                    const response = await getTagsCount();
                    if (response.error) {
                        throw response.error
                    }
                    return response.count;
                },
                staleTime: 5 * 60 * 1000
            },
            {
                queryKey: ["tags", page],
                queryFn: async () => {
                    const response = await getTags(page, 3);
                    if (response.error) {
                        throw response.error
                    }
                    return response.tags;
                },
                keepPreviousData: true,
                staleTime: 5 * 60 * 1000
            }]
    })
    const [countQuery, tagsQuery] = queries

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
                                <Link to={`/app/tags/${tag._id}`}  >{tag.heading}</Link>
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

//& Adding Tag Modal Component 
function AddTagForm({ closeModal }) {
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
    const addingTagMutation = useMutation({
        mutationFn: async (tagData) => {
            const response = await postTag(tagData);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["tags"])
            queryClient.invalidateQueries(["tagsCount"])
            closeModal()
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
            let tagData = values;
            const result = await addingTagMutation.mutateAsync(tagData)
            if (result.error) {
                setApiError(result.error.message);
            }
        },
    });

    //* Loading 
    if (addingTagMutation.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (addingTagMutation.isError) {
        return (<ErrorPage message={addingTagMutation.error.message} />)
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
                        <h2 className='text-4xl mb-5 font-semibold'>Add Tag</h2>
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
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <FormErrorArea condition={touched.color && errors.color} message={errors.color} />
                        <button type='submit' className='form-button w-10/12'>Add</button>
                    </form>
                </div>
            </div >
        </>
    )
}

//& Updating Tag Modal Component
function UpdateTagForm({ tag, closeModal }) {
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
    const updatingTagMutation = useMutation({
        mutationFn: async (tagData) => {
            const response = await patchTag(tagData, tag._id);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["tags"])
            queryClient.invalidateQueries(["tagsCount"])
            closeModal()
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
            heading: tag.heading,
            color: tag.color,
        },
        validationSchema: Schema,
        onSubmit: async (values) => {
            let tagData = values;
            const result = await updatingTagMutation.mutateAsync(tagData)
            if (result.error) {
                setApiError(result.error.message);
            }
        },

    });

    //* Loading 
    if (updatingTagMutation.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (updatingTagMutation.isError) {
        return (<ErrorPage message={updatingTagMutation.error.message} />)
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
                        <h2 className='text-4xl mb-5 font-semibold'>Update Tag</h2>
                        <FormErrorArea condition={apiError} message={apiError} />

                        <input
                            type="text"
                            id='heading'
                            name='heading'
                            className='form-input'
                            placeholder='Heading'
                            value={values.heading}
                            onChange={handleChange}
                            onBlur={handleBlur} />
                        <FormErrorArea condition={touched.heading && errors.heading} message={errors.heading} />

                        <input
                            type="color"
                            id='color'
                            name='color'
                            className='form-input'
                            placeholder='Color'
                            value={values.color}
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

function DeleteTagPrompt({ tag, closeModal }) {
    // * Hooks
    let queryClient = useQueryClient();
    let [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    // * Mutation
    const deletingTagMutation = useMutation({
        mutationFn: async () => {
            const response = await deleteTag(tag._id);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["tags"])
            queryClient.invalidateQueries(["tagsCount"])
            closeModal()
        }
    });
    // * Handlers
    async function Yes() {
        const result = await deletingTagMutation.mutateAsync(tag._id)
        if (result.error) {
            setApiError(result.error.message);
        }
    }

    function No() {
        closeModal()
    }

    //* Loading 
    if (deletingTagMutation.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (deletingTagMutation.isError) {
        return (<ErrorPage message={deletingTagMutation.error.message} />)
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
                        <h2 className='text-4xl mb-5 font-semibold'>Delete Tag</h2>
                        <FormErrorArea condition={apiError} message={apiError} />
                        <p className='text-center text-xl my-2'>Are you sure you want to delete this tag? the related task will stay but they will lost the tag field </p>
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