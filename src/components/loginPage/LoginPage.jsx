// ^ 3RD
import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';

// ? Locale
import FormErrorArea from "../FormErrorArea";
import { postLogin } from "../../client/auth"
import { userReducer, loggedIn } from "../../slices/userSlice"
import LoadingSpinner from "../LoadingSpinner";
import ErrorPage from "../ErrorPage";




function LoginPage() {

    //* Hooks
    const isLoggedIn = userReducer.getState().loggedIn
    let [apiError, setApiError] = useState('');
    const navigate = useNavigate()
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/app");
        }
    }, [])

    //* Validation Schema
    const Schema = Yup.object({
        emailOrUserName: Yup.string().trim().required("Please Enter A valid Username Or Email"),
        password: Yup.string().trim().min(8, "Password Cannot Be Correct").required("Password Is Required"),
    })

    //* React Query
    const loginMutation = useMutation({ mutationFn: async (userData) => { return postLogin(userData) } });

    //* Form Control
    const {
        handleSubmit,
        handleChange,
        handleBlur,
        touched,
        values,
        errors,
    } = useFormik({
        initialValues: {
            emailOrUserName: "",
            password: "",
        },
        validationSchema: Schema,
        onSubmit: async (values) => {
            let userData = values;
            const result = await loginMutation.mutateAsync(userData)
            if (!result?.data?.error) {
                userReducer.dispatch(loggedIn());
                navigate('/app')
            }
            else {
                if (result?.data?.error?.message === "Entity Not Found") { setApiError("User Is Not Registered"); }
                else { setApiError(result.data.error.message); }
            }
        },
    });


    //* Loading 
    if (loginMutation.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (loginMutation.isError) {
        return (<ErrorPage message={loginMutation.error.message} />)
    }

    //* Component 
    return (
        <>
            <div className='flex justify-center lg:justify-between'>
                <div className='h-screen w-6/12 p-5 hidden lg:block relative '>
                    <img src="image.jpg" alt="" className='h-full w-full rounded-xl' />
                    <div className='image-cover'></div>
                    <div className=' absolute top-20 left-20'>
                        <h1 className='text-yellow-400 text-5xl font-bold'>Tasker</h1>
                        <h3 className='text-white text-lg ml-10 font-bold'>Because We Belive That Time Is Money</h3>
                    </div>
                </div>
                <div className='h-screen lg:w-6/12 p-5'>
                    <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center h-full w-full'>
                        <h2 className='text-4xl mb-5 font-semibold'>Log In</h2>
                        <FormErrorArea condition={apiError} message={apiError} />

                        <input
                            type='text'
                            id='emailOrUserName'
                            name='emailOrUserName'
                            className='form-input'
                            placeholder='Email Or Username'
                            onChange={handleChange}
                            onBlur={handleBlur} />
                        <FormErrorArea condition={touched.emailOrUserName && errors.emailOrUserName} message={errors.emailOrUserName} />

                        <input
                            type='password'
                            id='password'
                            name='password'
                            className='form-input'
                            placeholder='Password'
                            onChange={handleChange}
                            onBlur={handleBlur} />
                        <FormErrorArea condition={touched.password && errors.password} message={errors.password} />

                        <button type='submit' className='form-button'>Log In</button>
                        <span>You Don't Have An Account? <Link to="/register" className="text-yellow-600">Sign Up</Link></span>
                    </form>
                </div>
            </div >
        </>
    )
}

export default LoginPage;