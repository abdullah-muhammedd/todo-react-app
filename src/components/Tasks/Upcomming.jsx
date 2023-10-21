//^3rd
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faX, faSquareMinus, faCalendarXmark, faSquare, faStar } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useMutation, useQueryClient, useInfiniteQuery, useQuery, useQueries } from '@tanstack/react-query'
import { useFormik } from 'formik';
import * as Yup from 'yup';

//? Locale
import FormErrorArea from '../FormErrorArea'
import LoadingSpinner from '../LoadingSpinner'
import ErrorPage from '../ErrorPage'
import Portal from '../Portal'
import SmallSpinner from '../SmallSpinner'
import TasksView from './TasksView'
import { getTasksNonDone, postTask } from '../../client/tasks'
import { getLists, getListsCount } from '../../client/lists'
import { getTags, getTagsCount } from '../../client/tags'

//& The Main Component 
export default function Inbox() {
    //* Hooks
    const bottomRef = useRef(null);
    const [inboxCount, setInboxCount] = useState(0);
    const [focusedTask, setFocusedTask] = useState({});

    //* Add Task Form Modal Control
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    const openAddTaskModal = () => {
        setIsAddTaskModalOpen(true);
    };
    const closeAddTaskModal = () => {
        setIsAddTaskModalOpen(false);
    };

    // // //* Delete List Check Prompt Control
    // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    // const openDeleteNoteModal = () => {
    //     setIsDeleteModalOpen(true);
    // };

    // const closeDeleteNoteModal = () => {
    //     setIsDeleteModalOpen(false);
    // };

    //* Queries 
    const countQuery = useQuery(
        {
            queryKey: ["tasksCount", "inboxCount"],
            queryFn: async () => {
                const response = await getTasksNonDone();
                if (response.error) {
                    throw response.error
                }
                return response.tasks.length;
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
        queryKey: ["tasks", "inbox"],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getTasksNonDone(pageParam, 20);
            if (response.error) {
                throw response.error;
            }
            return response.tasks;
        },
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage > Math.ceil(inboxCount / 20) ? undefined : nextPage;
        },
        staleTime: 5 * 60 * 1000
    });


    //* Effect
    useEffect(() => {
        (async () => {
            if (countQuery.data) {
                setInboxCount(countQuery.data);
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
                isAddTaskModalOpen ? (
                    <Portal>
                        <AddTaskForm closeModal={closeAddTaskModal} />
                    </Portal >
                ) : null
            }
            {/*

            {
                isDeleteModalOpen ? (
                    <Portal>
                        <DeleteNotePrompt note={focusedNote} closeModal={closeDeleteNoteModal} />
                    </Portal>
                ) : null
            } */}
            <div className={`bg-gray-100 w-full h-fit my-3 mx-3 p-6 rounded-lg text-gray-700 relative`}>
                <h1 className='md:text-4xl text-3xl font ml-14'>Inbox<span className='m-1 px-3 py-1 bg-gray-300 rounded-md '>{inboxCount}</span></h1>
                <div className='flex flex-col items-center my-5 h-full'>
                    <div className="w-full h-12 rounded-md p-2 my-2 border border-solid  border-gray-300 hover:bg-gray-300 flex items-center cursor-pointer mx-auto" onClick={() => { openAddTaskModal() }} >
                        <span className=' p-2 text-lg w-full '>
                            <FontAwesomeIcon icon={faPlus} /> Add New Task
                        </span>
                    </div>
                    <TasksView tasks={data.pages.flat()} />
                    {isFetchingNextPage ? (
                        <div className=" absolute bottom-0 left-1/2 text-xl">
                            <SmallSpinner />
                        </div>
                    ) : null}
                </div>
                <div ref={bottomRef}></div>
            </div >
        </>
    )
}

//& Adding Task Modal Component 
function AddTaskForm({ closeModal }) {
    // * Hooks
    let queryClient = useQueryClient();
    let [apiError, setApiError] = useState('');
    let subtasksRef = useRef(null);
    const navigate = useNavigate();

    // * Validation Schema
    const Schema = Yup.object({
        heading: Yup.string().trim().required("Heading Is Required"),
        description: Yup.string().trim(),
        dueDate: Yup.date(),
        listID: Yup.string().trim(),
        tagID: Yup.string().trim(),
        subTasks: Yup.array().of(Yup.object({
            heading: Yup.string().trim(),
            done: Yup.boolean()
        })).default([])
    })

    // * Mutation
    const addingTaskMutation = useMutation({
        mutationFn: async (taskData) => {
            const response = await postTask(taskData);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["tasks"])
            queryClient.invalidateQueries(["tasksCount"])
            closeModal();
        }
    });

    //* Count Queries
    const countQueries = useQueries({
        queries: [
            {
                queryKey: ["listsCount"],
                queryFn: async () => {
                    const response = await getListsCount();
                    if (response.error) {
                        throw response.error
                    }
                    return response.count;
                },
                staleTime: 5 * 60 * 1000
            },
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
            }
        ]
    })
    const [countLists, countTags] = countQueries

    //* getting tags and lists queries 
    const fetchingQueries = useQueries({
        queries: [
            {
                queryKey: ["lists", "all"],
                queryFn: async () => {
                    const response = await getLists(1, countLists.data);
                    if (response.error) {
                        throw response.error
                    }
                    return response.lists;
                },
                staleTime: 5 * 60 * 1000
            },
            {
                queryKey: ["tags", "all"],
                queryFn: async () => {

                    const response = await getTags(1, countTags.data);
                    if (response.error) {
                        throw response.error
                    }
                    return response.tags;
                },
                staleTime: 5 * 60 * 1000
            }
        ]
    })
    const [listsQuery, tagsQuery] = fetchingQueries
    // * Formik
    const {
        handleSubmit,
        handleChange,
        handleBlur,
        touched,
        values,
        errors,
        setFieldValue
    } = useFormik({
        initialValues: {
            heading: "",
            dueDate: "",
            listID: "",
            tagID: "",
            subTasks: []
        },
        validationSchema: Schema,
        onSubmit: async (values) => {
            let taskData = values;
            const result = await addingTaskMutation.mutateAsync(taskData)
            if (result.error) {
                setApiError(result.error.message);
            }
        },
    });

    //* Loading 
    if (addingTaskMutation.isLoading || listsQuery.isLoading || tagsQuery.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (addingTaskMutation.isError) {
        return (<ErrorPage message={addingTaskMutation.error.message} />)
    }
    if (tagsQuery.isError) {
        return (<ErrorPage message={tagsQuery.error.message} />)
    }
    if (listsQuery.isError) {
        return (<ErrorPage message={listsQuery.error.message} />)
    }

    //* Component 
    return (
        <>

            <div className='bg-gray-100 duration-200 w-3/6 h-5/6 my-3 ml-3 mr-6 p-6 rounded-lg text-gray-700 absolute right-0 top-0 z-50 overflow-y-auto'>
                <form
                    onSubmit={handleSubmit}
                    className=' relative flex flex-col justify-center items-center p-5 bg-gray-100 rounded-md'>
                    <FontAwesomeIcon icon={faX}
                        className=' absolute top-0 right-0 cursor-pointer hover:text-yellow-400 duration-200 text-lg'
                        onClick={() => closeModal()} />
                    <h2 className='text-3xl my-5 font-semibold'>Add Task</h2>
                    <FormErrorArea condition={apiError} message={apiError} />

                    <input type="text"
                        id='heading'
                        name='heading'
                        className='form-input'
                        placeholder='Heading'
                        value={values.heading}
                        onChange={handleChange}
                        onBlur={handleBlur} />
                    <FormErrorArea condition={touched.heading && errors.heading} message={errors.heading} />

                    <textarea
                        id='description'
                        name='description'
                        className='form-input'
                        placeholder='Description'
                        value={values.content}
                        onChange={handleChange}
                        onBlur={handleBlur} />
                    <FormErrorArea condition={touched.description && errors.description} message={errors.description} />

                    <input
                        type="date"
                        id='dueDate'
                        name='dueDate'
                        className='form-input'
                        placeholder='Due Date'
                        value={values.dueDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <FormErrorArea condition={touched.dueDate && errors.dueDate} message={errors.dueDate} />


                    <select name="listID" value={values.listID} id="listID" className='form-input' onChange={handleChange}
                        onBlur={handleBlur}>
                        <option value={null} selected>--List</option>
                        {
                            listsQuery.data.map(list => {
                                return (
                                    <option value={list._id}> {list.heading}</option>
                                )
                            })
                        }
                    </select>
                    <FormErrorArea condition={touched.listID && errors.listID} message={errors.listID} />

                    <select name="tagID" value={values.tagID} id="tagID" className='form-input' onChange={handleChange}
                        onBlur={handleBlur}>
                        <option value={null} selected>--Tag</option>
                        {
                            tagsQuery.data.map(tag => {
                                return (
                                    <option value={tag._id} > {tag.heading}</option>
                                )
                            })
                        }
                    </select>
                    <FormErrorArea condition={touched.tagID && errors.tagID} message={errors.tagID} />

                    <div className="w-full h-12 rounded-md p-2 my-2 border border-solid border-gray-300 hover:bg-gray-300 flex items-center cursor-pointer mx-auto"
                        onClick={() => {
                            const newSubtask = {
                                heading: '',
                                done: false,
                            };
                            setFieldValue('subTasks', [...values.subTasks, newSubtask]);
                        }}>
                        <span className="p-2 text-sm w-full">
                            <FontAwesomeIcon icon={faPlus} /> Add Subtask
                        </span>
                    </div>
                    <div ref={subtasksRef}>
                        {values.subTasks.map((subtask, index) => (
                            <div key={index} className="w-full h-12 rounded-md p-2 my-2 flex items-center cursor-pointer mx-auto">
                                <input
                                    type="checkbox"
                                    name={`subTasks[${index}].done`}
                                    className="mr-2 rounded-md"
                                    checked={subtask.done}
                                    onChange={(e) => setFieldValue(`subTasks[${index}].done`, e.target.checked)}
                                />
                                <input
                                    type="text"
                                    name={`subTasks[${index}].heading`}
                                    className="form-input w-full"
                                    placeholder="New Subtask"
                                    value={subtask.heading}
                                    onChange={(e) => setFieldValue(`subTasks[${index}].heading`, e.target.value)}
                                />
                                <button
                                    onClick={() => {
                                        const updatedSubTasks = [...values.subTasks];
                                        updatedSubTasks.splice(index, 1);
                                        setFieldValue('subTasks', updatedSubTasks);
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <FormErrorArea condition={touched.color && errors.color} message={errors.color} />
                    <button type='submit' className='form-button w-32'>Add</button>
                </form>
            </div >
        </>
    )
}