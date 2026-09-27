import React, { useEffect, useState } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import type { Place, CategoryId } from '../types/place';

interface GoogleMapComponentProps {
  apiKey: string;
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place | null) => void;
  center: [number, number];
  zoom: number;
  directionsResponse: google.maps.DirectionsResult | null;
  onQuotaOrAuthError: (errorMessage: string) => void;
}

// Subcomponent to animate camera when selectedPlace or center changes
function GoogleMapController({
  center,
  zoom,
  selectedPlace,
  hasDirections,
}: {
  center: [number, number];
  zoom: number;
  selectedPlace: Place | null;
  hasDirections: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || hasDirections) return;

    if (selectedPlace) {
      map.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
      map.setZoom(15);
    } else {
      map.panTo({ lat: center[0], lng: center[1] });
      map.setZoom(zoom);
    }
  }, [map, center, zoom, selectedPlace, hasDirections]);

  // Enable Transit Layer (도쿄 지하철/철도 노선)
  useEffect(() => {
    if (!map || !(window as any).google?.maps?.TransitLayer) return;
    const transitLayer = new (window as any).google.maps.TransitLayer();
    transitLayer.setMap(map);

    return () => {
      transitLayer.setMap(null);
    };
  }, [map]);

  return null;
}

// Subcomponent to render Directions polyline on Google Map
function RouteRenderer({ directionsResponse }: { directionsResponse: google.maps.DirectionsResult | null }) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!routesLib || !map) return;

    const renderer = new routesLib.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#2563eb',
        strokeWeight: 6,
        strokeOpacity: 0.85,
      },
    });

    setDirectionsRenderer(renderer);

    return () => {
      renderer.setMap(null);
    };
  }, [routesLib, map]);

  useEffect(() => {
    if (!directionsRenderer) return;

    directionsRenderer.setDirections(directionsResponse);

    if (directionsResponse && map) {
      const bounds = directionsResponse.routes[0]?.bounds;
      if (bounds) {
        map.fitBounds(bounds, 60);
      }
    }
  }, [directionsRenderer, directionsResponse, map]);

  return null;
}

const CATEGORY_COLORS: Record<CategoryId, { background: string; borderColor: string; glyphColor: string }> = {
  all: { background: '#3B82F6', borderColor: '#1D4ED8', glyphColor: '#FFFFFF' },
  narita_special: { background: '#EC4899', borderColor: '#BE185D', glyphColor: '#FFFFFF' },
  restaurant: { background: '#EF4444', borderColor: '#B91C1C', glyphColor: '#FFFFFF' },
  cafe: { background: '#F59E0B', borderColor: '#D97706', glyphColor: '#FFFFFF' },
  attraction: { background: '#8B5CF6', borderColor: '#6D28D9', glyphColor: '#FFFFFF' },
  shopping: { background: '#10B981', borderColor: '#047857', glyphColor: '#FFFFFF' },
  transit: { background: '#06B6D4', borderColor: '#0E7490', glyphColor: '#FFFFFF' },
  stay: { background: '#6366F1', borderColor: '#4338CA', glyphColor: '#FFFFFF' },
};

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  apiKey,
  places,
  selectedPlace,
  onSelectPlace,
  center,
  zoom,
  directionsResponse,
  onQuotaOrAuthError,
}) => {
  const [infoWindowPlace, setInfoWindowPlace] = useState<Place | null>(null);

  // Monitor Google Maps global authentication error
  useEffect(() => {
    (window as any).gm_authFailure = () => {
      console.warn('Google Maps API Key Authentication / Quota Failure detected');
      onQuotaOrAuthError('구글맵 API 키 인증 실패 또는 무료 할당량이 소진되었습니다. 콘솔에서 결제 설정 및 할당량을 확인해주세요.');
    };

    return () => {
      delete (window as any).gm_authFailure;
    };
  }, [onQuotaOrAuthError]);

  useEffect(() => {
    if (selectedPlace) {
      setInfoWindowPlace(selectedPlace);
    }
  }, [selectedPlace]);

  return (
    <APIProvider apiKey={apiKey} libraries={['routes']}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Map
          defaultCenter={{ lat: center[0], lng: center[1] }}
          defaultZoom={zoom}
          mapId="narita_tokyo_explorer_map"
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: '100%', height: '100%' }}
        >
          <GoogleMapController 
            center={center} 
            zoom={zoom} 
            selectedPlace={selectedPlace} 
            hasDirections={Boolean(directionsResponse)}
          />

          <RouteRenderer directionsResponse={directionsResponse} />

          {/* Markers */}
          {places.map((place) => {
            const isSelected = selectedPlace?.id === place.id;
            const colors = CATEGORY_COLORS[place.category] || CATEGORY_COLORS.all;

            return (
              <AdvancedMarker
                key={place.id}
                position={{ lat: place.lat, lng: place.lng }}
                onClick={() => {
                  onSelectPlace(place);
                  setInfoWindowPlace(place);
                }}
                title={place.name}
              >
                <Pin
                  background={isSelected ? '#0f172a' : colors.background}
                  borderColor={isSelected ? '#ffffff' : colors.borderColor}
                  glyphColor={colors.glyphColor}
                  scale={isSelected ? 1.3 : 1.0}
                />
              </AdvancedMarker>
            );
          })}

          {infoWindowPlace && !directionsResponse && (
            <InfoWindow
              position={{ lat: infoWindowPlace.lat, lng: infoWindowPlace.lng }}
              onCloseClick={() => setInfoWindowPlace(null)}
            >
              <div style={{ padding: '8px 4px', maxWidth: '240px', color: '#0f172a' }}>
                <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700, marginBottom: '2px' }}>
                  ★ {infoWindowPlace.rating} ({infoWindowPlace.reviewCount.toLocaleString()}) · {infoWindowPlace.priceLevel}
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800 }}>
                  {infoWindowPlace.name}
                </h4>
                <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#64748b' }}>
                  {infoWindowPlace.nameJa}
                </p>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#2563eb',
                    background: '#eff6ff',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    fontWeight: 600,
                  }}
                >
                  ⏱ {infoWindowPlace.transitTip}
                </div>
                <button
                  onClick={() => onSelectPlace(infoWindowPlace)}
                  style={{
                    width: '100%',
                    padding: '6px 0',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  상세 정보 보기
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};
