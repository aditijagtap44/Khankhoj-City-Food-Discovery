import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Layers, Sparkles, Filter, MapPin, Compass, Maximize2, Minimize2 } from 'lucide-react';

const TILE_PROVIDERS = {
  streets: {
    name: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
  dark: {
    name: 'Dark Canvas',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '© CARTO, © OpenStreetMap',
  },
  satellite: {
    name: 'Topography',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors',
  },
};

// Calculate Haversine distance in KM
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
};

// Custom Marker Icons
const createPlaceMarkerIcon = (place) => {
  const isGem = place.is_hidden_gem;
  const isVeg = place.diet_type === 'pure_veg';
  const bgColor = isGem 
    ? 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)' 
    : isVeg 
      ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
      : 'linear-gradient(135deg, #FF5E36 0%, #E8380D 100%)';

  const badgeIcon = isGem ? '💎' : isVeg ? '🌿' : '🍲';

  return L.divIcon({
    className: `custom-map-pin ${isGem ? 'pulse-marker' : ''}`,
    html: `
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        background: ${bgColor};
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(0,0,0,0.45);
        border: 2px solid #FFFFFF;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <div style="
          transform: rotate(45deg);
          font-size: 14px;
          line-height: 1;
        ">
          ${badgeIcon}
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -36],
  });
};

const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'user-location-pin',
    html: `
      <div style="
        position: relative;
        width: 24px;
        height: 24px;
      ">
        <div style="
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.35);
          animation: map-pin-pulse 1.8s infinite ease-out;
        "></div>
        <div style="
          position: absolute;
          top: 4px;
          left: 4px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #2563EB;
          border: 2px solid #FFFFFF;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const MapView = ({ places = [], center = [18.5204, 73.8567], zoom = 13, height = '450px' }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerGroupRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [activeTile, setActiveTile] = useState('streets');
  const [filterMode, setFilterMode] = useState('all'); // all, gem, veg, street
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const defaultLat = places.length > 0 ? (places[0].latitude || center[0]) : center[0];
    const defaultLng = places.length > 0 ? (places[0].longitude || center[1]) : center[1];

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: zoom,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    // Add zoom control at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Tile Layer
    const tileLayer = L.tileLayer(TILE_PROVIDERS[activeTile].url, {
      attribution: TILE_PROVIDERS[activeTile].attribution,
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Marker Layer Group
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = markersGroup;

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Tile Provider Switch
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newTileLayer = L.tileLayer(TILE_PROVIDERS[activeTile].url, {
      attribution: TILE_PROVIDERS[activeTile].attribution,
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTileLayer;
  }, [activeTile]);

  // Render Markers on Filter or Places change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;

    const group = markersLayerGroupRef.current;
    group.clearLayers();

    const filteredPlaces = places.filter((place) => {
      if (filterMode === 'gem') return place.is_hidden_gem;
      if (filterMode === 'veg') return place.diet_type === 'pure_veg';
      if (filterMode === 'street') return place.category === 'street_food';
      return true;
    });

    const bounds = [];

    filteredPlaces.forEach((place) => {
      if (place.latitude && place.longitude) {
        const marker = L.marker([place.latitude, place.longitude], {
          icon: createPlaceMarkerIcon(place),
        });

        const distanceText = userLocation
          ? calculateDistance(userLocation.lat, userLocation.lng, place.latitude, place.longitude)
          : null;

        const popupContent = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px; padding: 4px;">
            ${
              place.image_url
                ? `<img src="${place.image_url}" alt="${place.name}" style="width: 100%; height: 105px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />`
                : ''
            }
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 3px;">
              <h4 style="font-size: 14px; font-weight: 800; margin: 0; color: var(--text-primary, #1E293B);">${place.name}</h4>
              ${place.is_hidden_gem ? `<span style="font-size: 10px; background: rgba(168, 85, 247, 0.2); color: #9333EA; padding: 2px 6px; border-radius: 9999px; font-weight: 700;">💎 Gem</span>` : ''}
            </div>
            <p style="font-size: 12px; color: var(--primary, #FF5E36); font-weight: 700; margin: 0 0 3px 0;">★ ${place.specialty || 'Specialty Dish'}</p>
            <p style="font-size: 11px; color: var(--text-secondary, #64748B); margin: 0 0 6px 0;">📍 ${place.area || ''}</p>
            
            ${distanceText ? `<div style="font-size: 11px; font-weight: 700; color: #2563EB; margin-bottom: 8px;">📍 ${distanceText} away from you</div>` : ''}

            <div style="display: flex; gap: 6px; align-items: center; margin-top: 6px;">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; font-size: 11px; font-weight: 700; color: #FFFFFF; background: linear-gradient(135deg, #FF5E36, #FA4315); padding: 5px 10px; border-radius: 9999px; text-decoration: none;">
                Directions ↗
              </a>
              <a href="/place/${place.id}" style="font-size: 11px; font-weight: 700; color: var(--text-primary, #1E293B); background: var(--bg-surface, #F1F5F9); padding: 5px 10px; border-radius: 9999px; text-decoration: none; border: 1px solid var(--border-subtle, #E2E8F0);">
                Details
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        group.addLayer(marker);
        bounds.push([place.latitude, place.longitude]);
      }
    });

    if (bounds.length > 1 && !userLocation) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [places, filterMode, userLocation]);

  // Handle Geolocation
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 14, { duration: 1.5 });

          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          const userMarker = L.marker([latitude, longitude], {
            icon: createUserLocationIcon(),
          })
            .addTo(mapInstanceRef.current)
            .bindPopup('<b>You are here!</b><br/>Discovering nearby food spots.')
            .openPopup();

          userMarkerRef.current = userMarker;
        }
      },
      (err) => {
        setLocating(false);
        console.warn('Geolocation failed:', err.message);
        alert('Could not retrieve your location. Please check location permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '90vh' : height,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-bright)',
        boxShadow: 'var(--shadow-md)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Top Map Control Bar */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 1000,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.45rem',
          maxWidth: 'calc(100% - 70px)',
        }}
      >
        {/* Quick Filter Chips */}
        {[
          { id: 'all', label: 'All Spots', icon: null },
          { id: 'gem', label: '💎 Hidden Gems', icon: Sparkles },
          { id: 'veg', label: '🌿 Pure Veg', icon: null },
          { id: 'street', label: '🍲 Street Food', icon: null },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterMode(f.id)}
            style={{
              background: filterMode === f.id ? 'var(--primary)' : 'var(--bg-glass)',
              backdropFilter: 'blur(12px)',
              color: filterMode === f.id ? '#FFFFFF' : 'var(--text-primary)',
              border: filterMode === f.id ? '1px solid var(--primary)' : '1px solid var(--border-bright)',
              borderRadius: 'var(--radius-full)',
              padding: '0.35rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Bottom Map Controls: Layer Switcher & Locate Me */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '14px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {/* Locate Me GPS Button */}
        <button
          onClick={handleLocateUser}
          disabled={locating}
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(12px)',
            color: userLocation ? '#2563EB' : 'var(--text-primary)',
            border: userLocation ? '1px solid #3B82F6' : '1px solid var(--border-bright)',
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
          }}
          title="Find places near your location"
        >
          <Navigation size={14} className={locating ? 'pulse-marker' : ''} />
          <span>{locating ? 'Locating...' : userLocation ? 'Location Active' : 'Locate Me'}</span>
        </button>

        {/* Tile Provider Switcher */}
        <div
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-bright)',
            borderRadius: 'var(--radius-full)',
            padding: '0.2rem',
            display: 'flex',
            gap: '0.2rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {Object.entries(TILE_PROVIDERS).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setActiveTile(key)}
              style={{
                background: activeTile === key ? 'var(--primary)' : 'transparent',
                color: activeTile === key ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.6rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {value.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapView;
