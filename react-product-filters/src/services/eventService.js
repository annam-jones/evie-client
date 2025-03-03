import axios from "axios";
import { getToken } from "../utils/auth";

// Create a configured axios instance
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/events`,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add an interceptor to include authorization token
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

// Global error handler
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error('API Error Response:', {
      status: error.response.status,
      data: error.response.data
    });
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
  } else {
    // Something happened in setting up the request
    console.error('Error setting up request:', error.message);
  }
  throw error;
};

// Fetch all events
export const eventIndex = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch a single event
export const eventShow = async (eventId) => {
  try {
    const response = await apiClient.get(`/${eventId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Create a new event
export const eventCreate = async (formData) => {
  try {
    const response = await apiClient.post('/', formData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update an existing event
export const eventUpdate = async (eventId, formData) => {
  try {
    const response = await apiClient.put(`/${eventId}`, formData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete an event
export const eventDelete = async (eventId) => {
  try {
    await apiClient.delete(`/${eventId}`);
  } catch (error) {
    return handleApiError(error);
  }
};

// Mark event attendance
export const attendEvent = async (eventId) => {
  try {
    const response = await apiClient.put(`/${eventId}/attend`, {});
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Cancel event attendance
export const cancelEventAttendance = async (eventId) => {
  try {
    const response = await apiClient.put(`/${eventId}/cancel-attend`, {});
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch events a profile is attending
export const getAttendingEvents = async (profileId) => {
  try {
    const response = await apiClient.get(`/profile/${profileId}/attending`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};