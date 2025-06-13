import React, { useState } from "react";

export default function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <div className="bg-white relative">
            {/* Header */}
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-3 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>
                    <img className="h-12 w-auto" src="logo.png" alt="" />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                    <span className="sr-only">Open main menu</span>
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <a href="#" className="text-sm font-semibold text-gray-900">Product</a>
                    <a href="#" className="text-sm font-semibold text-gray-900">Solutions</a>
                    <a href="#" className="text-sm font-semibold text-gray-900">Pricing</a>
                    <a href="#" className="text-sm font-semibold text-gray-900">About Us</a>
                    <a href="#" className="text-sm font-semibold text-gray-900">Support</a>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:justify-end sm:items-center">
                    <a href="#" className="mr-4 text-sm font-semibold text-gray-900">Log in</a>
                    <a
                    href="#"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-indigo-600"
                    >
                    Start free trial
                    </a>
                </div>
                </nav>

                {/* Mobile Menu Slide Panel (no backdrop) */}
                <div
                className={`fixed top-0 right-0 z-50 w-80 h-full bg-white shadow-lg px-6 py-6 transition-transform duration-300 ${
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
                >
                <div className="flex items-center justify-between mb-6">
                    <a href="#" className="-m-1.5 p-1.5">
                    <img className="h-8 w-auto" src="logo.png" alt="Logo" />
                    </a>
                    <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                    >
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <a href="#" className="block text-base font-semibold text-gray-900">Product</a>
                    <a href="#" className="block text-base font-semibold text-gray-900">Solutions</a>
                    <a href="#" className="block text-base font-semibold text-gray-900">Pricing</a>
                    <a href="#" className="block text-base font-semibold text-gray-900">About Us</a>
                    <a href="#" className="block text-base font-semibold text-gray-900">Support</a>
                    <a href="#" className="block text-base font-semibold text-gray-900">Log in</a>
                </div>
                </div>
            </header>

            {/* Login Dialog */}
            <div className="relative isolate pt-24 flex flex-1 items-center justify-center px-4 lg:pt-48">
                {/* Top Gradient Pattern */}
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
                        }}
                    />
                </div>

                <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl flex flex-col">
                    <div className="flex flex-col sm:flex-row">
                        {/* Sign Up */}
                        <div className="w-full sm:w-1/2 px-6 py-10 flex flex-col justify-start items-center space-y-4">
                            <h2 className="text-xl font-semibold mb-10">Sign up</h2>

                            <button className="w-full border border-gray-300 rounded-full py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                                Continue with Google
                            </button>

                            <button className="w-full border border-gray-300 rounded-full py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50">
                                <img src="https://www.svgrepo.com/show/452196/facebook-1.svg" alt="Facebook" className="h-5 w-5" />
                                Continue with Facebook
                            </button>

                            <button className="w-full border border-gray-300 rounded-full py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v3H2V5zm0 5h16v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5z" />
                                </svg>
                                Sign up with email
                            </button>

                            <p className="text-xs text-gray-500 text-center px-4 pt-2">
                                By signing up, you agree to the <a href="#" className="underline">Terms of Service</a> and acknowledge you've read our <a href="#" className="underline">Privacy Policy</a>.
                            </p>
                        </div>

                        {/* Vertical Divider */}
                        <div className="hidden sm:block w-px bg-gray-200 my-6"></div>

                        {/* Log In */}
                        <div className="w-full sm:w-1/2 px-6 py-8 flex flex-col justify-center">
                            <h2 className="text-xl font-semibold mb-4 text-center">Log in</h2>
                            <label className="text-sm text-gray-700 mb-1">Email address</label>
                            <input
                                type="email"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-indigo-200"
                                placeholder="you@example.com"
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
                            />

                            <div className="mb-4 text-right">
                                <a href="#" className="text-sm text-indigo-600 underline">Forget your password?</a>
                            </div>

                            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-full">
                                Log in
                            </button>
                        </div>
                    </div>

                    {/* Divider + Language */}
                    <div className="border-t border-gray-200 mt-4 flex justify-center items-center px-4 py-2">
                        <div></div>
                        <div className="text-sm text-gray-500">
                        English (United States) ▼
                        </div>
                    </div>
                </div>

                {/* Bottom Gradient Pattern */}
                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
                    <div
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                        style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
