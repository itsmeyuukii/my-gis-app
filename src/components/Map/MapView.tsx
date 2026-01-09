import { useEffect, useRef } from 'react';
import maplibregl, { Map } from 'maplibre-gl';

const MapView = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      // style: 'https://demotiles.maplibre.org/style.json',
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [121.0, 14.6],
      zoom: 6,
    });

    map.on('load', () => {
      console.log('✅ Map loaded');
      map.resize(); // 🔴 forces redraw
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
       className="w-full h-full absolute top-0 left-0"
    />
  );
};

export default MapView;
