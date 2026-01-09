import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Environment configuration for multiple APIs
interface ApiEndpoints {
  main: string;
  auth: string;
  gis: string;
  upload: string;
}

const API_ENDPOINTS: ApiEndpoints = {
  main: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  auth: import.meta.env.VITE_AUTH_API_URL || 'https://auth.example.com',
  gis: import.meta.env.VITE_GIS_API_URL || 'https://gis.example.com',
  upload: import.meta.env.VITE_UPLOAD_API_URL || 'https://upload.example.com',
};

// Default API Configuration
const API_CONFIG = {
  baseURL: API_ENDPOINTS.main,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosInstance = axios.create(API_CONFIG);

// Create multiple axios instances for different APIs
export const authInstance = axios.create({
  ...API_CONFIG,
  baseURL: API_ENDPOINTS.auth,
});

export const gisInstance = axios.create({
  ...API_CONFIG,
  baseURL: API_ENDPOINTS.gis,
});

export const uploadInstance = axios.create({
  ...API_CONFIG,
  baseURL: API_ENDPOINTS.upload,
  timeout: 60000, // Longer timeout for uploads
});

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
  const bearerToken = `Bearer ${token}`;
  
  // Set token for all instances
  axiosInstance.defaults.headers.common['Authorization'] = bearerToken;
  authInstance.defaults.headers.common['Authorization'] = bearerToken;
  gisInstance.defaults.headers.common['Authorization'] = bearerToken;
  uploadInstance.defaults.headers.common['Authorization'] = bearerToken;
};

export const removeAuthToken = () => {
  authToken = null;
  
  // Remove token from all instances
  delete axiosInstance.defaults.headers.common['Authorization'];
  delete authInstance.defaults.headers.common['Authorization'];
  delete gisInstance.defaults.headers.common['Authorization'];
  delete uploadInstance.defaults.headers.common['Authorization'];
};

export const setBaseURL = (url: string, instance: 'main' | 'auth' | 'gis' | 'upload' = 'main') => {
  switch (instance) {
    case 'main':
      axiosInstance.defaults.baseURL = url;
      break;
    case 'auth':
      authInstance.defaults.baseURL = url;
      break;
    case 'gis':
      gisInstance.defaults.baseURL = url;
      break;
    case 'upload':
      uploadInstance.defaults.baseURL = url;
      break;
  }
};

// Request interceptor function
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // Add timestamp to prevent caching
  if (config.params) {
    config.params._t = Date.now();
  } else {
    config.params = { _t: Date.now() };
  }

  // Add auth token if available
  if (authToken && config.headers) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }

  console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
};

// Response interceptor function
const responseSuccessInterceptor = (response: AxiosResponse) => {
  console.log(`✅ Response: ${response.status} ${response.config.url}`);
  return response.data;
};

// Error interceptor function
const responseErrorInterceptor = (error: AxiosError) => {
  const { response, request, message } = error;
  
  if (response) {
    // Server responded with error status
    const { status, data } = response;
    console.error(`❌ Response Error: ${status}`, data);
    
    // Handle specific status codes
    switch (status) {
      case 401:
        // Unauthorized - remove token
        removeAuthToken();
        break;
      case 403:
        console.error('Access forbidden');
        break;
      case 404:
        console.error('Resource not found');
        break;
      case 500:
        console.error('Internal server error');
        break;
      default:
        console.error('An error occurred:', (data as any)?.message || message);
    }
    
    return Promise.reject({
      status,
      message: (data as any)?.message || message,
      data: data,
    });
  } else if (request) {
    // Network error
    console.error('❌ Network Error:', message);
    return Promise.reject({
      status: 0,
      message: 'Network error. Please check your connection.',
    });
  } else {
    // Something else happened
    console.error('❌ Error:', message);
    return Promise.reject({
      status: 0,
      message: message || 'An unexpected error occurred',
    });
  }
};

// Apply interceptors to all instances
const instances = [axiosInstance, authInstance, gisInstance, uploadInstance];

instances.forEach(instance => {
  // Request interceptor
  instance.interceptors.request.use(requestInterceptor, (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  });

  // Response interceptor
  instance.interceptors.response.use(
    responseSuccessInterceptor,
    responseErrorInterceptor
  );
});

export { API_ENDPOINTS };
export default axiosInstance;