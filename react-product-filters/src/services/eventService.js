import axios from "axios";
import { getToken } from "../utils/auth";


const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/events`,
  headers: {
    'Content-Type': 'application/json',
  }
});


apiClient.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

const handleApiError = (error) => {
  if (error.response) {
  
    console.error('API Error Response:', {
      status: error.response.status,
      data: error.response.data
    });
  } else if (error.request) {

    console.error('No response received:', error.request);
  } else {
   
    console.error('Error setting up request:', error.message);
  }
  throw error;
};


export const eventIndex = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};


export const eventShow = async (eventId) => {
  try {
    const response = await apiClient.get(`/${eventId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};


export const eventCreate = async (formData) => {
  try {
    const response = await apiClient.post('/', formData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};


export const eventUpdate = async (eventId, formData) => {
  try {
    const response = await apiClient.put(`/${eventId}`, formData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};


export const eventDelete = async (eventId) => {
  try {
    await apiClient.delete(`/${eventId}`);
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAttendingEvents = async () => {
  try {
    const response = await apiClient.get(`/profile/`);
    console.log("Profile response:", response.data);
    return response.data.attending_events || [];
  } catch (error) {
    return handleApiError(error);
  }
};



export const attendEvent = async (eventId) => {

  try {
    
    const response = await apiClient.post(`/${eventId}/attend/`, {});
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const cancelEventAttendance = async (eventId) => {
   try {
    
    const response = await apiClient.post(`/${eventId}/attend/`, {});
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};