import React, { useState } from 'react';

import ForgotPasswordForm from './ForgotPasswordForm';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ toggleForm }) => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const userIndex = users.findIndex(
            (u) => u.email === email && u.userPass === password
        );

        if (userIndex !== -1) {
            const loginTime = new Date().toLocaleString();
            users[userIndex].loginTime = loginTime;

            // update only users array
            localStorage.setItem("users", JSON.stringify(users));

            console.log("Login successful:", users[userIndex]);
            alert("Login successful!");

            navigate("/users");
        } else {
            alert("Invalid email or password");
        }
    };



    const toggleForgotPassword = () => {
        setShowForgotPassword(!showForgotPassword);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-300">
            {showForgotPassword ? (
                <ForgotPasswordForm toggleForgotPassword={toggleForgotPassword} />
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-[#202020] text-white p-2 rounded-md hover:bg-[#111111] transition duration-200"
                        >
                            Login
                        </button>
                        <span className='flex justify-end'>
                            <button
                                type="button"
                                onClick={toggleForgotPassword}
                                className="cursor-pointer text-sm text-blue-500 hover:underline focus:outline-none mt-2"
                            >
                                Forgot Password?
                            </button>
                        </span>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button onClick={toggleForm} className="text-blue-500 cursor-pointer hover:underline focus:outline-none">
                            Sign Up
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
};

export default LoginForm;