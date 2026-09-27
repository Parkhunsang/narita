import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Place, CategoryId } from '../types/place';

// Fix default Leaflet icon paths in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Category color and icon map
const CATEGORY_STYLES: Record<CategoryId, { bg: string; icon: string }> = {
  all: { bg: '#3B82F6', icon: '📍' },
  my_stay: { bg: '#16A34A', icon: '🏨' },
  sushi: { bg: '#0EA5E9', icon: '🍣' },
  ramen: { bg: '#EF4444', icon: '🍜' },
  meat: { bg: '#F97316', icon: '🥩' },
  izakaya: { bg: '#A855F7', icon: '🍢' },
  cafe: { bg: '#F59E0B', icon: '☕' },
  attraction: { bg: '#8B5CF6', icon: '🗼' },
  shopping: { bg: '#10B981', icon: '🛍️' },
  narita_special: { bg: '#EC4899', icon: '✈️' },
  transit: { bg: '#06B6D4', icon: '🚆' },
  stay: { bg: '#16A34A', icon: '🏨' },
  restaurant: { bg: '#EF4444', icon: '🍜' },
};

function createCustomPin(category: CategoryId, isSelected: boolean) {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.all;
  const pinSize = isSelected ? 42 : 34;
  const iconSize = isSelected ? 18 : 14;

  const html = `
    <div class="custom-pin ${isSelected ? 'active' : ''}" style="
      background-color: ${style.bg};
      width: ${pinSize}px;
      height: ${pinSize}px;
      border: 2px solid #ffffff;
    ">
      ${isSelected ? '<div class="pulse-ring" style="border: 2px solid ' + style.bg + ';"></div>' : ''}
      <div class="custom-pin-inner" style="font-size: ${iconSize}px;">
        ${style.icon}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-pin',
    iconSize: [pinSize, pinSize],
    iconAnchor: [pinSize / 2, pinSize],
    popupAnchor: [0, -pinSize],
  });
}

// Subcomponent to animate/recenter map
function MapController({
  center,
  zoom,
  selectedPlace,
}: {
  center: [number, number];
  zoom: number;
  selectedPlace: Place | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      map.flyTo([selectedPlace.lat, selectedPlace.lng], 15, {
        duration: 1.2,
      });
    } else {
      map.flyTo(center, zoom, {
        duration: 1.0,
      });
    }
  }, [center, zoom, selectedPlace, map]);

  return null;
}

interface MapComponentProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place | null) => void;
  center: [number, number];
  zoom: number;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  center,
  zoom,
}) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapController center={center} zoom={zoom} selectedPlace={selectedPlace} />

        {places.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          return (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createCustomPin(place.category, isSelected)}
              eventHandlers={{
                click: () => {
                  onSelectPlace(place);
                },
              }}
            >
              <Popup>
                <div style={{ padding: '12px 14px', maxWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontWeight: 600,
                      }}
                    >
                      {place.priceLevel}
                    </span>
                    <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>
                      ★ {place.rating}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    {place.name}
                  </h4>
                  <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#64748b' }}>
                    {place.nameJa}
                  </p>
                  <div
                    style={{
                      fontSize: '11.5px',
                      color: '#2563eb',
                      background: '#eff6ff',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      marginBottom: '10px',
                      fontWeight: 500,
                    }}
                  >
                    ⏱ {place.transitTip}
                  </div>
                  <button
                    onClick={() => onSelectPlace(place)}
                    style={{
                      width: '100%',
                      padding: '7px 0',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    상세 정보 및 길찾기
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
