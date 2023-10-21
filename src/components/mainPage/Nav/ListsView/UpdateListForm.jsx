//^3rd
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useFormik } from 'formik';


//? Locale
import FormErrorArea from '../../../FormErrorArea'
import LoadingSpinner from '../../../LoadingSpinner'
import ErrorPage from '../../../ErrorPage'
import { updateListMutation } from '../../../../query/list'
import listScheam from '../../../../validation/listScheam'

//& Updating List Modal Component
export default function UpdateListForm({ list, closeModal }) {
    // * Hooks
    let [apiError, setApiError] = useState('');

    // * Mutation
    const updatingListMutation = updateListMutation(() => { closeModal() })

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
        validationSchema: listScheam,
        onSubmit: async (values) => {
            let listData = values;
            listData._id = list._id;
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