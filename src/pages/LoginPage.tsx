import axios from 'axios';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const LoginPage: FC = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        const payload = {
            email: data.email,
            password: data.password
        };

        try {
            const response = await axios.post('https://lizmotors-backend.vercel.app/api/login', payload);
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            reset();
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className='h-screen w-screen bg-stone-200 flex items-center justify-center'>
            <div className='bg-white w-1/4 h-fit shadow-md rounded-xl space-y-2 p-2'>
                <div className='text-2xl font-bold flex justify-center mt-2 text-blue-600'>Log In</div>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-2'>
                    <label htmlFor="email" className='text-lg ml-2'>Email</label>
                    <div className='w-full flex justify-center mr-2'>
                        <input
                            id="email"
                            {...register("email", {
                                required: "required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Entered value does not match email format",
                                },
                            })}
                            type="email"
                            placeholder='user@mail.com'
                            className='w-11/12 m-2 p-2 outline-2 border border-stone-200 rounded-md'
                        />
                    </div>
                    <label htmlFor="password" className='text-lg ml-2'>Password</label>
                    <div className='w-full flex justify-center mr-2'>
                        <input
                            id="password"
                            {...register("password", {
                                required: "required",
                                minLength: {
                                    value: 6,
                                    message: "min length is 6",
                                },
                            })}
                            type="password"
                            placeholder='123456'
                            className='w-11/12 m-2 p-2 outline-2 border border-stone-200 rounded-md'
                        />
                    </div>
                    <div className='w-full flex justify-center mr-2'>
                        <button type="submit" className='bg-blue-500 py-2 rounded-md text-white hover:bg-blue-700 w-11/12 m-2'>Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
