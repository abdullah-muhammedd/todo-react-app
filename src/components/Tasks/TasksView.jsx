import { faPlus, faX, faSquareMinus, faCalendarXmark, faSquare, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteTask, patchTask, toggleTaskDone } from '../../client/tasks'
import { useMutation, useQueryClient, useQueries } from '@tanstack/react-query'
import { useState, useRef } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';

import FormErrorArea from '../FormErrorArea'
import LoadingSpinner from '../LoadingSpinner'
import ErrorPage from '../ErrorPage'
import Portal from '../Portal'

import { getLists, getListsCount } from '../../client/lists'
import { getTags, getTagsCount } from '../../client/tags'

export default function TasksView({ tasks }) {
    const queryClient = useQueryClient();
    const [focusedTask, setFocusedTask] = useState(null);
    const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false)

    const openUpdateTaskModal = () => {
        setIsUpdateTaskModalOpen(true);
    };
    const closeUpdataeTaskModal = () => {
        setIsUpdateTaskModalOpen(false);
    };

    //* Mutation
    const toogleDoneMutaion = useMutation({
        mutationFn: async (focused) => {
            await toggleTaskDone(focused._id);
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.queryCache.getAll().forEach((query) => {
                if (query.queryKey[0].startsWith("tasks")) {

                    queryClient.setQueryData(query.queryKey, newData ?? []);
                }
            });
            queryClient.invalidateQueries(["tasks"])
            queryClient.invalidateQueries(["tasksCount"])
        }
    });

    //* Loading 
    if (toogleDoneMutaion.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (toogleDoneMutaion.isError) {
        return (<ErrorPage message={toogleDoneMutaion.error.message} />)
    }

    return (
        <>
            {
                isUpdateTaskModalOpen ? (
                    <Portal>
                        <UpdateTaskForm task={focusedTask} closeModal={closeUpdataeTaskModal} />
                    </Portal>
                ) : null
            }
            {tasks.map((task) => (
                <div
                    key={task._id}
                    className=" flex flex-col w-full h-fit rounded-md p-2 my-2 border border-solid  border-gray-300 hover:bg-gray-300 cursor-pointer mx-auto"
                >
                    <div className=' flex items-center w-full mb-2 hover:bg-gray-300  '>
                        <input type="checkbox" className="w-5 h-5 aspect-square rounded-md mr-2" checked={task.done}
                            onChange={async () => {
                                await toogleDoneMutaion.mutateAsync(task)
                            }} />
                        <span
                            className="inline-flex items-center text-xl h-1/2 w-5/6"
                            style={{ textDecoration: task.done ? "line-through" : 'none', textDecorationThickness: "3px" }}
                            onClick={() => { setFocusedTask(task); openUpdateTaskModal() }}
                        >
                            {task.heading}
                        </span>
                    </div>
                    <div className='flex text-sm flex-wrap'>
                        {
                            task.dueDate && (
                                <span className={`flex items-center  ${new Date(task.dueDate) <= Date.now() ? 'text-red-700' : ''}`}>
                                    <FontAwesomeIcon icon={faCalendarXmark} className='mr-1' />
                                    <span>{task.dueDate.split("T")[0]}</span>
                                    < div className="bg-gray-300 w-0.5 h-7 mx-2 rounded-md inline-block"></div>
                                </span>)
                        }
                        {
                            task.subTasksCount > 0 && (
                                <span className={`flex items-center`}>
                                    <span className='m-1 px-2 py-1 bg-gray-400 rounded-md font-bold'>{task.subTasksCount}</span>
                                    subtasks
                                    < div className="bg-gray-300 w-0.5 h-7 mx-2 rounded-md inline-block"></div>
                                </span>)
                        }
                        {
                            task.listID && (
                                <span className={`flex items-center`}>
                                    <FontAwesomeIcon icon={faSquare} className='mr-1' style={{ color: task.listID.color }} />
                                    {task.listID.heading}
                                    < div className="bg-gray-300 w-0.5 h-7 mx-2 rounded-md inline-block"></div>
                                </span>)
                        }
                        {
                            task.tagID && (
                                <span className={`flex items-center`}>
                                    <FontAwesomeIcon icon={faStar} className='mr-1' style={{ color: task.tagID.color }} />
                                    {task.tagID.heading}
                                    < div className="bg-gray-300 w-0.5 h-7 mx-2 rounded-md inline-block"></div>
                                </span>)
                        }
                    </div>
                </div>
            ))}
        </>
    )
}

//& Updating Task Modal Component
export function UpdateTaskForm({ task, closeModal }) {
    // * Hooks
    let queryClient = useQueryClient();
    let [apiError, setApiError] = useState('');
    let subtasksRef = useRef(null);

    // * Validation Schema
    const Schema = Yup.object({
        heading: Yup.string().trim().required("Heading Is Required"),
        description: Yup.string().trim(),
        dueDate: Yup.date(),
        listID: Yup.string().trim(),
        tagID: Yup.string().trim(),
        subTasks: Yup.array().of(Yup.object({
            heading: Yup.string().trim().default("New Task"),
            done: Yup.boolean()
        }))
    })

    // * Mutation
    const updatingTaskMutation = useMutation({
        mutationFn: async (taskData) => {
            const response = await patchTask(taskData, task._id);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["tasks"])
            queryClient.invalidateQueries(["tasksCount"])
            closeModal();
        }
    });

    const deletingTaskMutation = useMutation({
        mutationFn: async () => {
            const response = await deleteTask(task._id);
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
            heading: task.heading,
            description: task.description,
            dueDate: new Date(task.dueDate),
            listID: task?.listID?._id ?? "",
            tagID: task?.tagID?._id ?? "",
            subTasks: task.subTasks.map((sub) => {
                return { heading: sub.heading, done: sub.done }
            })
        },
        validationSchema: Schema,
        onSubmit: async (values) => {
            let taskData = values;
            const result = await updatingTaskMutation.mutateAsync(taskData)
            if (result.error) {
                setApiError(result.error.message);
            }
        },
    });

    //* Loading 
    if (updatingTaskMutation.isLoading || deletingTaskMutation.isLoading || listsQuery.isLoading || tagsQuery.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (updatingTaskMutation.isError) {
        return (<ErrorPage message={updatingTaskMutation.error.message} />)
    }
    if (tagsQuery.isError) {
        return (<ErrorPage message={tagsQuery.error.message} />)
    }
    if (listsQuery.isError) {
        return (<ErrorPage message={listsQuery.error.message} />)
    }
    if (deletingTaskMutation.isError) {
        return (<ErrorPage message={deletingTaskMutation.error.message} />)
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
                    <h2 className='text-3xl my-5 font-semibold'>Update Task</h2>
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
                        value={values.description}
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
                                    <option value={list._id} key={list._id} selected={list._id === values.listID}> {list.heading}</option>
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
                                    <option value={tag._id} key={tag._id} selected={tag._id === values.tagID}> {tag.heading}</option>
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
                                    value={subtask.heading || "New Subtask"}
                                    onChange={(e) => setFieldValue(`subTasks[${index}].heading`, e.target.value || "New Subtask")}
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
                    <button type='submit' className='form-button w-32'>save</button>
                </form>
                <div className='flex justify-center w-full'>
                    <button className='form-button w-32' onClick={() => { deletingTaskMutation.mutateAsync() }}>Delete</button>
                </div>
            </div >
        </>
    )
}
