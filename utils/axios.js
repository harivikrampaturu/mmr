// axios.js
import axios from 'axios';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Router } from 'next/navigation';

const handleLogout = async () => {
  try {
    // Sign out from Firebase
    await signOut(auth);

    // Call your logout API to clear the cookie using Axios
    await axios.post('/api/logout');

    // Redirect to login page after successful logout
    Router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
    // Optionally, handle any logout errors here
  }
};

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true // Ensure cookies are sent with each request if needed
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    if (error.response && error.response.status === 401) {
      await handleLogout();
      // If a 401 response is received, log out the user

      // Clear any stored tokens or session data here if necessary
      // e.g., removing cookies if set, or localStorage token removal
      document.cookie = 'token=; Max-Age=0; path=/;';

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login'; // Redirect if on client-side
      }
    }
    return Promise.reject(error);
  }
);

export default api;
