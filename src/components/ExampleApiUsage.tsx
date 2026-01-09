// Example: How to use the multiple API setup in your React components

import React, { useState, useEffect } from 'react';
import { authApi, userApi, gisApi } from '../api/apiServices';
import { httpUpload } from '../api/service';
import type { User, Location } from '../api/types';

const ExampleComponent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  // Example 1: Authentication with Auth API
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login({ email, password });
      console.log('✅ Logged in successfully:', response.user);
      setUser(response.user);
    } catch (error: any) {
      console.error('❌ Login failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Fetch user profile using Main API
  const fetchUserProfile = async () => {
    try {
      const userProfile = await userApi.getProfile();
      setUser(userProfile);
    } catch (error: any) {
      console.error('❌ Failed to fetch profile:', error.message);
    }
  };

  // Example 3: Search locations using GIS API
  const searchLocations = async (query: string) => {
    try {
      setLoading(true);
      const results = await gisApi.searchLocation(query);
      setLocations(results);
      console.log('✅ Found locations:', results);
    } catch (error: any) {
      console.error('❌ Search failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Example 4: File upload using Upload API
  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      
      const result = await httpUpload(
        '/files/upload',
        file,
        (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`📁 Upload progress: ${progress}%`);
        }
      );
      
      console.log('✅ File uploaded successfully:', result);
    } catch (error: any) {
      console.error('❌ File upload failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Example 5: Get map data with bounds using GIS API
  const fetchMapData = async () => {
    try {
      const mapData = await gisApi.getMapData({
        north: 40.7831,
        south: 40.7489,
        east: -73.9441,
        west: -73.9927
      });
      console.log('🗺️ Map data:', mapData);
    } catch (error: any) {
      console.error('❌ Failed to fetch map data:', error.message);
    }
  };

  useEffect(() => {
    // Auto-fetch user profile on component mount if logged in
    if (user) {
      fetchUserProfile();
    }
  }, []);

  return (
    <div>
      <h2>Multi-API Example</h2>
      
      {/* Login Form */}
      <div>
        <h3>Authentication (Auth API)</h3>
        <button onClick={() => handleLogin('user@example.com', 'password')}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div>
          <h3>User Profile (Main API)</h3>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}

      {/* Search Locations */}
      <div>
        <h3>Location Search (GIS API)</h3>
        <button onClick={() => searchLocations('New York')}>
          Search Locations
        </button>
        {locations.length > 0 && (
          <ul>
            {locations.map(location => (
              <li key={location.id}>
                {location.name} - Lat: {location.latitude}, Lng: {location.longitude}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* File Upload */}
      <div>
        <h3>File Upload (Upload API)</h3>
        <input 
          type="file" 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
      </div>

      {/* Map Data */}
      <div>
        <h3>Map Data (GIS API)</h3>
        <button onClick={fetchMapData}>
          Fetch Map Data
        </button>
      </div>
    </div>
  );
};

export default ExampleComponent;