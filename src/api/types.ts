// API Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// GIS Types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Layer {
  id: string;
  name: string;
  type: string;
  data: any[];
}