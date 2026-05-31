import axios from "axios";
import { authRegistry } from "../2-context/authContext";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

export const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {

      if (error.response?.data?.message === 'Access token is expired' && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const role = authRegistry.getRole();
          const refreshEndpoint = role === "Admin"
            ? "/admin/refreshToken"
            : "/refreshToken";

          await refreshApi.get(refreshEndpoint);

          return api(originalRequest);
        } catch (error) {
          authRegistry.logout();
          return Promise.reject(error);
        }
      }

      authRegistry.logout();
      return Promise.reject(error); // for 401 errors other than expired token
    }

    if(error.response?.status === 404) {
      if(error.response?.data?.message === 'Client does not exist') {
        toast.error('Client does not exist');
        authRegistry.logout();
        window.location.replace(`/login`);
        return Promise.reject(error);
      }
      window.location.replace(`/404?message=${error.response.data?.message}`);
      return Promise.reject(error);
    }

    return Promise.reject(error); // for all other errors
  }
);