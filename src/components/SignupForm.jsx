import React from 'react';

const SignupForm = ({ toggleForm }) => {
    const handleSignup = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const pass = e.target.password.value;
        const confirmPass = e.target.confirmPassword.value;

        if (pass !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        // check duplicate email
        if (users.find((u) => u.email === email)) {
            alert("Email already registered!");
            return;
        }

        const newUser = { name, email, userPass: pass, loginTime: "" };
        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));
        alert("Signup successful!");
        console.log("Signup data saved:", newUser);
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-300">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="mt-1 w-full text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#202020]"
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mt-1 w-full text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#202020]"
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
                            className="mt-1 w-full text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#202020]"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="mt-1 w-full text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#202020]"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-[#202020] text-white p-2 rounded-md hover:bg-[#111111] transition duration-200"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button onClick={toggleForm} className="cursor-pointer text-blue-500 hover:underline focus:outline-none">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;