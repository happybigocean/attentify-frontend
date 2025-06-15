import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export async function login(email: string, password: string) {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      new URLSearchParams({ username: email, password }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.detail || "Login failed");
  }
}

export async function register(email: string, password: string) {
  try {
    const response = await axios.post(
      `${API_URL}/auth/register`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.detail || "Register failed");
  }
}
