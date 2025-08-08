import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export default function RegisterCompany() {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const [siteName, setSiteName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                `${API_URL}/company/create`,
                {
                    name: companyName,        
                    site_url: siteName,      
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate("/dashboard");
        } catch (err: any) {
            const message =
                err.response?.data?.detail || err.message || "Failed to register company";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-24 px-4">
            <h2 className="text-2xl font-semibold mb-4 text-center">Register Your Company</h2>

            {error && <div className="text-red-600 text-sm text-center mb-3">{error}</div>}

            <form onSubmit={handleSubmit} className="bg-white shadow-md  px-8 pt-6 pb-8 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Company Name</label>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="shadow appearance-none border  w-full py-2 px-3 text-gray-700 mb-4 focus:outline-none focus:shadow-outline"
                    placeholder="Acme Inc."
                />

                <label className="block text-gray-700 text-sm font-bold mb-2">Site Name</label>
                <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    required
                    className="shadow appearance-none border  w-full py-2 px-3 text-gray-700 mb-6 focus:outline-none focus:shadow-outline"
                    placeholder="acme-site"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2  disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Create Company"}
                </button>
            </form>
        </div>
    );
}
