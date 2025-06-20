import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../services/auth";

export default function Signup() {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await register(registerEmail, registerPassword, firstName, lastName);
            const { token, user } = data;
            localStorage.setItem("token", token);
            localStorage.setItem('user', JSON.stringify(user));
            setMessage("Registered! Redirecting...");
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1000);
        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white relative">
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-3 lg:px-8">
                    <div className="flex lg:flex-1">
                        <Link to="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Attentify</span>
                            <img className="h-12 w-auto" src="logo.png" alt="Attentify logo" />
                        </Link>
                    </div>
                </nav>
            </header>

            <div className="relative isolate pt-24 flex flex-1 items-center justify-center px-4 lg:pt-48">
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>

                <form onSubmit={handleRegister} className="bg-white rounded-xl shadow-lg w-full max-w-xl flex flex-col">
                    <div className="w-full px-6 py-8 flex flex-col justify-center">
                        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>

                        {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
                        {message && <div className="text-green-600 text-sm mb-2 text-center">{message}</div>}

                        <label className="text-sm text-gray-700 mb-1">First Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-indigo-200"
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />

                        <label className="text-sm text-gray-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-indigo-200"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />

                        <label className="text-sm text-gray-700 mb-1">Email address</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-indigo-200"
                            placeholder="you@example.com"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            required
                        />

                        <div className="flex justify-between items-center">
                            <label className="text-sm text-gray-700 mb-1">Password</label>
                            <button
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="text-sm text-gray-500 flex items-center gap-1"
                            >
                                {passwordVisible ? (
                                    <>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M13.875 18.825A10.05 10.05 0 0112 19.5C7.5 19.5 3.5 16.5 1.5 12c.673-1.57 1.662-3.018 2.91-4.2M10.5 6.75a7.5 7.5 0 016 3.75m-3 2.25a2.25 2.25 0 11-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3 3l18 18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Show
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Hide
                                    </>
                                )}
                            </button>
                        </div>

                        <input
                            type={passwordVisible ? "text" : "password"}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-1 focus:outline-none focus:ring focus:ring-indigo-200"
                            placeholder="••••••••"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 mt-5 rounded-full disabled:opacity-50"
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>

                        <div className="block h-px bg-gray-200 mx-6 my-6"></div>

                        <button
                            type="button"
                            className="w-full border border-gray-300 rounded-full py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                            Continue with Google
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-600 mt-0">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 hover:underline font-medium">
                            Log in
                        </Link>
                    </div>

                    <div className="border-t border-gray-200 mt-4 flex justify-center items-center px-4 py-2">
                        <div className="text-sm text-gray-500">English (United States) ▼</div>
                    </div>
                </form>

                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
