//^3rd
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useFormik } from 'formik';


//? Locale
import FormErrorArea from '../../../FormErrorArea'
import LoadingSpinner from '../../../LoadingSpinner'
import ErrorPage from '../../../ErrorPage'
import { addTagMutation } from '../../../../query/tag';
import tagSchema from '../../../../validation/tagSchema';

export default function AddTagForm({ closeModal }) {
    // * Hooks
    let [apiError, setApiError] = useState('');
    const addingTagMutation = addTagMutation(() => { closeModal() });

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
        validationSchema: tagSchema,
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