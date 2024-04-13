import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../../config/constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";


interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    password: string;
    username: string;
}

const SigninForm: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<FormValues>();
    const {t} = useTranslation()

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/session`, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                console.error("Sign-in failed. Status code:", response.status);
                toast.error("Sign-in failed. Please check your credentials.");
                return;
            }

            const responseData = await response.json();

            if (!responseData || !responseData.token) {
                console.error("Sign-in failed. Invalid response data:", responseData);
                toast.error("Sign-in failed. Invalid response data.");
                return;
            }
            console.log(responseData);

            localStorage.setItem("token", responseData.token);
            localStorage.setItem("firstName", responseData.user.firstName);
            localStorage.setItem("lastName", responseData.user.lastName);
            localStorage.setItem("email", responseData.user.email);
            localStorage.setItem("mobileNumber", responseData.user.mobileNumber);
            localStorage.setItem("userID", responseData.user.id);
            localStorage.setItem("userName", responseData.user.username);


            navigate("/");
            toast.success("Sign-in successful!");

        } catch (error) {
            console.error("Sign-in failed:", error);
            toast.error("Sign-in failed. An unexpected error occurred.");
        }
    };



    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    {t('Collaborative Blogging')}
                </a>
                <ToastContainer />
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            {t('Sign in to your account')}
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('Your email')}</label>
                                <input type="email"
                                    id="email"
                                    {...register("email", { required: true })}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('Password')}</label>
                                <input type="password"
                                    {...register("password", { required: true })} id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>

                            <button type="submit" className="w-full text-blue bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{t('Sign in')}</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                {t('Don’t have an account yet?')} <a href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">{t('Sign up')}</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SigninForm;