import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import axios from 'axios';

interface MapViewProps {}

export interface MapViewRef {
  addGeoJsonLayer: (geojsonUrl: string) => Promise<void>;
}

const MapView = forwardRef<MapViewRef, MapViewProps>((_, ref) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [121.0, 14.6],
      zoom: 6,
    });

    map.on('load', () => {
      console.log('✅ Map loaded');
      map.resize();
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Expose the addGeoJsonLayer method to the parent component
  useImperativeHandle(ref, () => ({
    addGeoJsonLayer: async (geojsonUrl: string) => {
      if (!mapRef.current) return;

      try {
        const response = await axios.get(geojsonUrl);
        const geojsonData = response.data;

        // Remove existing GeoJSON layer and source if they exist
        if (mapRef.current.getSource('geojson-data')) {
          mapRef.current.removeLayer('geojson-layer');
          mapRef.current.removeSource('geojson-data');
        }

        // Add GeoJSON source
        mapRef.current.addSource('geojson-data', {
          type: 'geojson',
          data: geojsonData,
        });

        // Add a layer to visualize the GeoJSON data
        mapRef.current.addLayer({
          id: 'geojson-layer',
          type: 'circle',
          source: 'geojson-data',
          paint: {
            'circle-radius': 8,
            'circle-color': [
              'match',
              ['get', 'status'], // Match based on the "status" property
              'Ongoing',
              '#007cbf', // Blue for "Ongoing"
              'Planned',
              '#ffcc00', // Yellow for "Planned"
              '#ff0000', // Default to red
            ],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
          },
        });

        console.log('✅ GeoJSON data added to the map');
      } catch (error) {
        console.error('❌ Failed to load GeoJSON data:', error);
      }
    },
  }));

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full absolute top-0 left-0"
    />
  );
});

export default MapView;