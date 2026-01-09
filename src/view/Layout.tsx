import { useRef } from 'react';
import MapView, { type MapViewRef } from '../components/Map/MapView';

const Layout = () => {
  const mapViewRef = useRef<MapViewRef>(null);

  const handleGetGeoJson = () => {
    const geojsonUrl = 'https://geojson-api-9ev1.onrender.com/api/projects/geojson';
    mapViewRef.current?.addGeoJsonLayer(geojsonUrl);
  };

  return (
    <div className="relative w-full h-screen">
      <MapView ref={mapViewRef} />
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={handleGetGeoJson}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow"
        >
          Get GeoJSON
        </button>
      </div>
    </div>
  );
};

export default Layout;