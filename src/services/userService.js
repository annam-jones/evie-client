import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL; 


export const register = async (formData) => {
  try {
    console.log("Sending registration data:", formData);
    const res = await axios.post(`${BASE_URL}/auth/register/`, formData);
    return res.data;
  } catch (error) {
    console.error("Register error:", error);
    
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    throw error;
  }
};


export const login = async (formData) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login/`, formData);
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};