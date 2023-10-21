//^3rd
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faX, faSquareMinus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useMutation, useQueryClient, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useFormik } from 'formik';
import * as Yup from 'yup';

//? Locale
import FormErrorArea from '../FormErrorArea'
import LoadingSpinner from '../LoadingSpinner'
import ErrorPage from '../ErrorPage'
import Portal from '../Portal'
import { getNotes, getNotesCount, postNote, patchNote, deleteNote } from '../../client/notes'
import SmallSpinner from '../SmallSpinner'

//& The Main Component 
export default function StickyWall() {
    //* Hooks
    const bottomRef = useRef(null);
    const [notesCount, setNotesCount] = useState(0);
    const [focusedNote, setFocusedNote] = useState({});

    //* Add Note Form Modal Control
    const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

    const openAddNoteModal = () => {
        setIsAddNoteModalOpen(true);
    };
    const closeAddNoteModal = () => {
        setIsAddNoteModalOpen(false);
    };

    //* Update List Form Modal Control
    const [isUpdateNoteModalOpen, setIsUpdateNoteModalOpen] = useState(false)

    const openUpdateNoteModal = () => {
        setIsUpdateNoteModalOpen(true);
    };
    const closeUpdataeNoteModal = () => {
        setIsUpdateNoteModalOpen(false);
    };

    // //* Delete List Check Prompt Control
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const openDeleteNoteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteNoteModal = () => {
        setIsDeleteModalOpen(false);
    };

    // * Helper 
    function isColorLight(color) {
        const hex = color.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        return yiq >= 128;
    }

    //* Queries 
    const countQuery = useQuery(
        {
            queryKey: ["notesCount"],
            queryFn: async () => {
                const response = await getNotesCount();
                if (response.error) {
                    throw response.error
                }
                return response.count;
            },
            staleTime: 5 * 60 * 1000
        },

    )

    const {
        status,
        error,
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["notes"],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getNotes(pageParam, 3);
            if (response.error) {
                throw response.error;
            }
            return response.stickyNotes;
        },
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage > Math.ceil(notesCount / 3) ? undefined : nextPage;
        },
        staleTime: 5 * 60 * 1000
    });


    //* Effect
    useEffect(() => {
        (async () => {
            if (countQuery.data) {
                setNotesCount(countQuery.data);
            }

            const handleScroll = () => {
                if (
                    bottomRef.current &&
                    window.innerHeight + window.scrollY >= bottomRef.current.offsetTop
                ) {
                    fetchNextPage();
                }
            };
            window.addEventListener("scroll", handleScroll);
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        })();
    }, [countQuery, fetchNextPage]);


    //* Loading 
    if (countQuery.isLoading || status === "loading") {
        return (
            <div className='bg-gray-100 w-full h-screen my-3 mx-3 p-6 rounded-lg text-gray-700 relative'>
                <div className='flex justify-center w-full items-center my-4 flex-wrap h-full'>
                    <LoadingSpinner />
                </div>
            </div>
        )
    }

    //* Error 
    if (countQuery.isError) {
        return (
            <div className='bg-gray-100 w-full h-screen my-3 mx-3 p-6 rounded-lg text-gray-700 relative'>
                <div className='flex justify-center items-center my-4 flex-wrap h-full'>
                    <ErrorPage message={countQuery.error.message} />
                </div>
            </div>
        )

    }
    if (error) {
        return (
            <div className='bg-gray-100 w-full h-screen my-3 mx-3 p-6 rounded-lg text-gray-700 relative'>
                <div className='flex justify-center w-full  items-center my-4 flex-wrap h-full'>
                    <ErrorPage message={error.message} />
                </div>
            </div>
        )
    }

    //* Component
    return (

        <>
            {
                isAddNoteModalOpen ? (
                    <Portal>
                        <AddNoteForm closeModal={closeAddNoteModal} />
                    </Portal>
                ) : null
            }
            {
                isUpdateNoteModalOpen ? (
                    <Portal>
                        <UpdateNoteForm note={focusedNote} closeModal={closeUpdataeNoteModal} />
                    </Portal>
                ) : null
            }
            {
                isDeleteModalOpen ? (
                    <Portal>
                        <DeleteNotePrompt note={focusedNote} closeModal={closeDeleteNoteModal} />
                    </Portal>
                ) : null
            }
            <div className={`bg-gray-100 w-full h-fit my-3 mx-3 p-6 rounded-lg text-gray-700 relative`}>
                <h1 className='md:text-4xl text-3xl font ml-14'>Sticky Wall  <span className='m-1 px-3 py-1 bg-gray-300 rounded-md '>{notesCount}</span></h1>
                <div className='flex justify-start gap-2 items-center my-4 flex-wrap h-full'>
                    <div className={`w-80 aspect-square rounded-md p-5 relative m-2 bg-gray-300 hover:bg-gray-400 flex justify-center items-center cursor-pointer mx-auto`} onClick={() => { openAddNoteModal() }} >
                        <span className='font-semibold text-xl '>
                            <FontAwesomeIcon icon={faPlus} className='text-6xl' />
                        </span>
                    </div>
                    {data.pages.flat().map((note) => (
                        < div
                            key={note._id}
                            className={`w-80 aspect-square rounded-md p-5 relative m-2 cursor-pointer mx-auto`}
                            style={{
                                backgroundColor: note.color,
                                color: isColorLight(note.color) ? "#161616" : "#f1f8e9",
                            }}
                        >
                            <span
                                className="font-semibold text-xl inline-block h-5/6 w-full"
                                onClick={() => {
                                    setFocusedNote(note);
                                    openUpdateNoteModal();
                                }}
                            >
                                {note.content}
                            </span>
                            <div className="absolute right-0 bottom-0 m-2">
                                <FontAwesomeIcon
                                    icon={faSquareMinus}
                                    className="text-lg cursor-pointer px-2 duration-200 hover:rotate-90 py-1 mx-1 rounded-md"
                                    onClick={() => {
                                        setFocusedNote(note);
                                        openDeleteNoteModal();
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    {isFetchingNextPage ? (
                        <div className=" absolute bottom-0 left-1/2 text-xl">
                            <SmallSpinner />
                        </div>
                    ) : null}
                </div>
            </div>
            <div ref={bottomRef}></div>
        </>
    )
}

//& Adding List Modal Component 
function AddNoteForm({ closeModal }) {
    // * Hooks
    let queryClient = useQueryClient();
    let [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    // * Validation Schema
    const Schema = Yup.object({
        content: Yup.string().trim().required("Content Is Required"),
        color: Yup.string().trim().default("#00FF00")
            .matches(/^#[a-fA-F0-9]{6}$/, 'Invalid Hexadecimal Color')
    })

    // * Mutation
    const addingNoteMutation = useMutation({
        mutationFn: async (noteData) => {
            const response = await postNote(noteData);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["notes"])
            queryClient.invalidateQueries(["notesCount"])
            closeModal();
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
            content: "",
            color: "#00FF00",
        },
        validationSchema: Schema,
        onSubmit: async (values) => {
            let noteData = values;
            const result = await addingNoteMutation.mutateAsync(noteData)
            if (result.error) {
                setApiError(result.error.message);
            }
        },
    });

    //* Loading 
    if (addingNoteMutation.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (addingNoteMutation.isError) {
        return (<ErrorPage message={addingNoteMutation.error.message} />)
    }


    //* Component 
    return (
        <>

            <div className='bg-gray-100 duration-200 w-72 h-5/6 my-3 ml-3 mr-6 p-6 rounded-lg text-gray-700 absolute right-0 top-0 z-50 overflow-y-auto'>
                <form
                    onSubmit={handleSubmit}
                    className=' relative flex flex-col justify-center items-center p-5 bg-gray-100 rounded-md'>
                    <FontAwesomeIcon icon={faX}
                        className=' absolute top-0 right-0 cursor-pointer hover:text-yellow-400 duration-200 text-lg'
                        onClick={() => closeModal()} />
                    <h2 className='text-3xl my-5 font-semibold'>Add Note</h2>
                    <FormErrorArea condition={apiError} message={apiError} />

                    <textarea
                        type="text"
                        id='content'
                        name='content'
                        className='form-input'
                        placeholder='Content'
                        value={values.content}
                        onChange={handleChange}
                        onBlur={handleBlur} />
                    <FormErrorArea condition={touched.content && errors.content} message={errors.content} />

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
                    <button type='submit' className='form-button w-32'>Add</button>
                </form>
            </div>
        </>
    )
}

//& Updating List Modal Component
function UpdateNoteForm({ note, closeModal }) {
    // * Hooks
    let queryClient = useQueryClient();
    let [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    // * Validation Schema
    const Schema = Yup.object({
        content: Yup.string().trim().required("Content Is Required"),
        color: Yup.string().trim().default("#00FF00")
            .matches(/^#[a-fA-F0-9]{6}$/, 'Invalid Hexadecimal Color')
    })

    // * Mutation
    const updatingNoteMutation = useMutation({
        mutationFn: async (noteData) => {
            const response = await patchNote(noteData, note._id);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["notes"])
            queryClient.invalidateQueries(["notesCount"])
            closeModal();
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
            content: note.content,
            color: note.color,
        },
        validationSchema: Schema,
        onSubmit: async (values) => {
            let noteData = values;
            const result = await updatingNoteMutation.mutateAsync(noteData)
            if (result.error) {
                setApiError(result.error.message);
            }
        },

    });

    //* Loading 
    if (updatingNoteMutation.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (updatingNoteMutation.isError) {
        return (<ErrorPage message={updatingNoteMutation.error.message} />)
    }

    //* Component 
    return (
        <>
            <div className='bg-gray-100 duration-200 w-72 h-5/6 my-3 ml-3 mr-6 p-6 rounded-lg text-gray-700 absolute right-0 top-0 z-50 overflow-y-auto'>
                <form
                    onSubmit={handleSubmit}
                    className=' flex flex-col justify-center items-center p-5 bg-gray-100 rounded-md'>
                    <FontAwesomeIcon icon={faX}
                        className=' absolute top-5 right-5 cursor-pointer hover:text-yellow-400 duration-200 text-lg'
                        onClick={() => closeModal()} />
                    <h2 className='text-3xl my-5 font-semibold'>Update Note</h2>
                    <FormErrorArea condition={apiError} message={apiError} />

                    <textarea
                        type="text"
                        id='content'
                        name='content'
                        className='form-input'
                        placeholder='Content'
                        value={values.content}
                        onChange={handleChange}
                        onBlur={handleBlur} />
                    <FormErrorArea condition={touched.content && errors.content} message={errors.content} />

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
                    <button type='submit' className='form-button w-32'>Update</button>
                </form>
            </div>
        </>
    )
}

function DeleteNotePrompt({ note, closeModal }) {
    // * Hooks
    let queryClient = useQueryClient();
    let [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    // * Mutation
    const deletingNoteMutation = useMutation({
        mutationFn: async () => {
            const response = await deleteNote(note._id);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["notes"])
            queryClient.invalidateQueries(["notesCount"])
            closeModal()
        }
    });
    // * Handlers
    async function Yes() {
        const result = await deletingNoteMutation.mutateAsync(note._id)
        if (result.error) {
            setApiError(result.error.message);
        }
    }

    function No() {
        closeModal();
    }

    //* Loading 
    if (deletingNoteMutation.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (deletingNoteMutation.isError) {
        return (<ErrorPage message={deletingNoteMutation.error.message} />)
    }


    //* Component 
    return (
        <>
            <div className='bg-gray-100 duration-200 w-72 h-5/6 my-3 ml-3 mr-6 p-6 rounded-lg text-gray-700 absolute right-0 top-0 z-50 overflow-y-auto'>
                <div
                    className=' flex flex-col justify-center items-center p-5 bg-gray-100 rounded-md'>
                    <FontAwesomeIcon icon={faX}
                        className=' absolute top-5 right-5 cursor-pointer hover:text-yellow-400 duration-200 text-lg'
                        onClick={() => closeModal()} />
                    <h2 className='text-3xl my-5 font-semibold'>Delete Note</h2>
                    <FormErrorArea condition={apiError} message={apiError} />
                    <p className='text-center text-xl my-2'>Are you sure you want to delete this note? </p>
                    <div className='flex flex-col'>
                        <button className='form-button md:w-48 w-32' onClick={() => Yes()}>Yes</button>
                        <button className='form-button md:w-48 w-32' onClick={() => No()}>No</button>
                    </div>
                </div>
            </div>
        </>
    )
}