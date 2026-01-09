import { authService, gisService, mainService } from './service';
import { setAuthToken, removeAuthToken } from './axiosInstance';
import type { User, LoginRequest, LoginResponse, ApiError, MapBounds, Location, Layer } from './types';

// Authentication API using auth service
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await authService.httpPost<LoginResponse>('/auth/login', credentials);
      // Set the auth token automatically after successful login
      if (response.token) {
        setAuthToken(response.token);
      }
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await authService.httpPost('/auth/logout', {});
      removeAuthToken();
    } catch (error) {
      // Even if logout fails, remove the token locally
      removeAuthToken();
      throw error as ApiError;
    }
  },

  refreshToken: async (): Promise<{ token: string }> => {
    return await authService.httpPost<{ token: string }>('/auth/refresh', {});
  },
};

// User API using main service
export const userApi = {
  getProfile: async (): Promise<User> => {
    return await mainService.httpGet<User>('/user/profile');
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    return await mainService.httpPut<User>('/user/profile', userData);
  },

  getUsers: async (params?: { page?: number; limit?: number }): Promise<{ users: User[]; total: number }> => {
    return await mainService.httpGet<{ users: User[]; total: number }>('/users', params);
  },

  deleteUser: async (id: number): Promise<void> => {
    return await mainService.httpDelete<void>(`/users/${id}`);
  },
};

// GIS/Map specific APIs using gis service
export const gisApi = {
  getMapData: async (bounds?: MapBounds) => {
    return await gisService.httpGet('/map-data', bounds);
  },

  getLayerData: async (layerId: string): Promise<Layer> => {
    return await gisService.httpGet<Layer>(`/layers/${layerId}`);
  },

  searchLocation: async (query: string): Promise<Location[]> => {
    return await gisService.httpGet<Location[]>('/search', { q: query });
  },

  createLayer: async (layerData: Omit<Layer, 'id'>): Promise<Layer> => {
    return await gisService.httpPost<Layer>('/layers', layerData);
  },

  updateLayer: async (layerId: string, layerData: Partial<Layer>): Promise<Layer> => {
    return await gisService.httpPut<Layer>(`/layers/${layerId}`, layerData);
  },

  deleteLayer: async (layerId: string): Promise<void> => {
    return await gisService.httpDelete<void>(`/layers/${layerId}`);
  },
};

// Example usage in components:
// import { userApi, authApi, gisApi } from '../api/apiServices';
// 
// const fetchUserProfile = async () => {
//   try {
//     const user = await userApi.getProfile();
//     console.log('User profile:', user);
//   } catch (error) {
//     console.error('Failed to fetch user profile:', error.message);
//   }
// };
//
// const searchForLocation = async (searchTerm: string) => {
//   try {
//     const locations = await gisApi.searchLocation(searchTerm);
//     console.log('Found locations:', locations);
//   } catch (error) {
//     console.error('Search failed:', error.message);
//   }
// };