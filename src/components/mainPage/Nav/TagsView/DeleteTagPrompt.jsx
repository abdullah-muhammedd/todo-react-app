
//^3rd
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

//? Locale
import FormErrorArea from '../../../FormErrorArea'
import LoadingSpinner from '../../../LoadingSpinner'
import ErrorPage from '../../../ErrorPage'
import { deleteTagMutation } from '../../../../query/tag'

export default function DeleteTagPrompt({ tag, closeModal }) {
    // * Hooks
    let [apiError, setApiError] = useState('');
    const deletingTagMutation = deleteTagMutation(() => { closeModal() })

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