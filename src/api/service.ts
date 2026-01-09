import axiosInstance, { authInstance, gisInstance, uploadInstance } from './axiosInstance';

// API Types - defined locally to avoid module resolution issues
export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

// Export the service with different instances for different APIs
export const createService = (instance = axiosInstance) => {
  const httpGet = async <T = any>(
    url: string, 
    params?: Record<string, any>,
    config?: Record<string, any>
  ): Promise<T> => {
    try {
      const response = await instance.get<T>(url, { params, ...config });
      return response as T;
    } catch (error) {
      throw error as ApiError;
    }
  };

  const httpPost = async <T = any>(
    url: string, 
    data: any, 
    config?: Record<string, any>
  ): Promise<T> => {
    try {
      const response = await instance.post<T>(url, data, config);
      return response as T;
    } catch (error) {
      throw error as ApiError;
    }
  };

  const httpPut = async <T = any>(
    url: string, 
    data: any, 
    config?: Record<string, any>
  ): Promise<T> => {
    try {
      const response = await instance.put<T>(url, data, config);
      return response as T;
    } catch (error) {
      throw error as ApiError;
    }
  };

  const httpPatch = async <T = any>(
    url: string, 
    data: any, 
    config?: Record<string, any>
  ): Promise<T> => {
    try {
      const response = await instance.patch<T>(url, data, config);
      return response as T;
    } catch (error) {
      throw error as ApiError;
    }
  };

  const httpDelete = async <T = any>(
    url: string, 
    config?: Record<string, any>
  ): Promise<T> => {
    try {
      const response = await instance.delete<T>(url, config);
      return response as T;
    } catch (error) {
      throw error as ApiError;
    }
  };

  return {
    httpGet,
    httpPost,
    httpPut,
    httpPatch,
    httpDelete
  };
};

// Create services for different API endpoints
export const mainService = createService(axiosInstance);
export const authService = createService(authInstance);
export const gisService = createService(gisInstance);
export const uploadService = createService(uploadInstance);

// File upload helper for upload service
export const httpUpload = async <T = any>(
  url: string,
  file: File | FormData,
  onProgress?: (progressEvent: any) => void
): Promise<T> => {
  try {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    const response = await uploadInstance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
    return response as T;
  } catch (error) {
    throw error as ApiError;
  }
};

// Export individual methods from main service for backward compatibility
export const { httpGet, httpPost, httpPut, httpPatch, httpDelete } = mainService;