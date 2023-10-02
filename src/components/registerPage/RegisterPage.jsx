// ^ 3RD
import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';

//? Locale
import FormErrorArea from "../FormErrorArea";
import { postSignup } from "../../client/auth"
import { userReducer } from "../../slices/userSlice"
import LoadingSpinner from "../LoadingSpinner";
import ErrorPage from "../ErrorPage";

function RegisterPage() {

    const isLoggedIn = userReducer.getState().loggedIn
    //* Hooks
    let [apiError, setApiError] = useState('');
    const navigate = useNavigate()
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/app");
        }
    }, [])


    //* Validation Schema
    const passwordRegex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
    const Schema = Yup.object({
        firstName: Yup.string().trim().required("First Name Is Required"),
        lastName: Yup.string().trim().required("Last Name Is Required"),
        userName: Yup.string().trim().min(3, "Username Is Too Short").max(30, "Username Is Too Long").required("Username Name Is Required"),
        email: Yup.string().trim().email("Email Is Not Valid").required("Email Is Required"),
        password: Yup.string().trim().min(8, "Password Must Be 8 Characters Or More ").matches(passwordRegex, "Password Must Contain 1 Uppercase, 1 Lowercase, And 1 Number").required("Password Is Required"),
        confirmPassword: Yup.string().trim().oneOf([Yup.ref('password'), null], 'Passwords must match').required("Confirm Password Is Required"),
    })

    //* React Quey 
    const registerMutation = useMutation({ mutationFn: async (userData) => { return postSignup(userData) } });

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
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Schema,
        onSubmit: async (values) => {
            let userData = values;
            const result = await registerMutation.mutateAsync(userData)
            if (!result.error) {
                navigate('/login')
            }
            else {
                setApiError(result.error.message);
            }
        },
    });

    //* Loading 
    if (registerMutation.isLoading) {
        return (<LoadingSpinner />)
    }

    //* Error 
    if (registerMutation.isError) {
        return (<ErrorPage message={registerMutation.error.message} />)
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
                        <h2 className='text-4xl mb-5 font-semibold'>Sign Up</h2>
                        <FormErrorArea condition={apiError} message={apiError} />
                        <input
                            type="text"
                            id='firstName'
                            name='firstName'
                            className='form-input'
                            placeholder='First Name'
                            onChange={handleChange}
                            onBlur={handleBlur} />
                        <FormErrorArea condition={touched.firstName && errors.firstName} message={errors.firstName} />

                        <input
                            type="text"
                            id='lastName'
                            name='lastName'
                            className='form-input'
                            placeholder='Last Name'
                            onChange={handleChange}
                            onBlur={handleBlur} />
                        <FormErrorArea condition={touched.lastName && errors.lastName} message={errors.lastName} />

                        <input
                            type='text'
                            id='userName'
                            name='userName'
                            className='form-input'
                            placeholder='Username'
                            onChange={handleChange}
                            onBlur={handleBlur} />
                        <FormErrorArea condition={touched.userName && errors.userName} message={errors.userName} />

                        <input
                            type='email'
                            id='email'
                            name='email'
                            className='form-input'
                            placeholder='Email'
                            onChange={handleChange}
                            onBlur={handleBlur} />
                        <FormErrorArea condition={touched.email && errors.email} message={errors.email} />

                        <input
                            type='password'
                            id='password'
                            name='password'
                            className='form-input'
                            placeholder='Password'
                            onChange={handleChange}
                            onBlur={handleBlur} />
                        <FormErrorArea condition={touched.password && errors.password} message={errors.password} />

                        <input
                            type='password'
                            id='confirmPassword'
                            name='confirmPassword'
                            className='form-input'
                            placeholder='Confirm Password'
                            onChange={handleChange}
                            onBlur={handleBlur} />
                        <FormErrorArea condition={touched.confirmPassword && errors.confirmPassword} message={errors.confirmPassword} />

                        <button type='submit' className='form-button'>Sign Up</button>
                        <span>You Already Have An Account? <Link to="/login" className="text-yellow-600">Login</Link></span>
                    </form>
                </div>
            </div >
        </>
    )
}

export default RegisterPage;