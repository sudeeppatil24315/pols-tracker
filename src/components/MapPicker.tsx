import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
  title: string;
}

export default function MapPicker({ onLocationSelect, initialLat = 12.9716, initialLng = 77.5946, title }: MapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return; // Already initialized

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.error('Mapbox token not found');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [initialLng, initialLat],
        zoom: 12,
      });

      // Wait for map to load
      map.current.on('load', () => {
        console.log('Map picker loaded successfully');
      });

      // Add click handler
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        
        // Remove existing marker
        if (marker.current) {
          marker.current.remove();
        }

        // Add new marker
        marker.current = new mapboxgl.Marker({ color: '#F9D71C' })
          .setLngLat([lng, lat])
          .addTo(map.current!);

        setSelectedLocation({ lat, lng });
      });
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }

    return () => {
      if (marker.current) {
        marker.current.remove();
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialLat, initialLng]);

  const handleConfirm = async () => {
    if (!selectedLocation) {
      alert('Please click on the map to select a location');
      return;
    }

    // Get address from coordinates using reverse geocoding
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedLocation.lng},${selectedLocation.lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const address = data.features[0]?.place_name || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`;
      
      onLocationSelect(selectedLocation.lat, selectedLocation.lng, address);
    } catch (error) {
      console.error('Failed to get address:', error);
      onLocationSelect(selectedLocation.lat, selectedLocation.lng, `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">Click anywhere on the map to select location</p>
      </div>
      
      <div ref={mapContainer} className="flex-1 min-h-[400px]" />
      
      <div className="p-4 border-t border-gray-700 flex justify-between items-center">
        {selectedLocation && (
          <div className="text-sm text-gray-300">
            Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
          </div>
        )}
        <button
          onClick={handleConfirm}
          disabled={!selectedLocation}
          className="bg-[#F9D71C] hover:bg-[#e5c619] text-black font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
}
