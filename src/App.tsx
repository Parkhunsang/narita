import { useState, useEffect, useMemo } from 'react';
import { PLACES_DATA, REGIONS } from './data/placesData';
import type { Place, CategoryId, RegionId } from './types/place';
import { MapComponent } from './components/MapComponent';
import { GoogleMapComponent } from './components/GoogleMapComponent';
import { SearchBar } from './components/SearchBar';
import { CategoryChips } from './components/CategoryChips';
import { RegionSelector } from './components/RegionSelector';
import { Sidebar } from './components/Sidebar';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { TransitModal } from './components/TransitModal';
import { QuotaAlertModal } from './components/QuotaAlertModal';
import { MapSettingsModal } from './components/MapSettingsModal';
import { DirectionsPanel } from './components/DirectionsPanel';
import type { LocationPoint, TravelMode, RouteResult } from './types/directions';
import { fetchGoogleDirections } from './utils/directionsService';
import { Plane, Compass, Navigation, Layers, ShieldCheck } from 'lucide-react';

const SAVED_STORAGE_KEY = 'tokyo_narita_saved_places_v1';

export function App() {
  const [places] = useState<Place[]>(PLACES_DATA);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedRegion, setSelectedRegion] = useState<RegionId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [detailPlace, setDetailPlace] = useState<Place | null>(null);
  const [isTransitModalOpen, setIsTransitModalOpen] = useState(false);
  const [isSavedOnly, setIsSavedOnly] = useState(false);

  // Read API Key strictly from environment variable, NEVER expose in UI
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [mapProvider, setMapProvider] = useState<'google' | 'leaflet'>(() => {
    return googleApiKey ? 'google' : 'leaflet';
  });

  // Settings modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [quotaAlertInfo, setQuotaAlertInfo] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });

  // Directions state
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [directionsDestPlace, setDirectionsDestPlace] = useState<Place | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [isDirectionsLoading, setIsDirectionsLoading] = useState(false);
  const [directionsError, setDirectionsError] = useState<string | null>(null);

  // Saved bookmarks persistence
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedPlaceIds));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedPlaceIds]);

  const toggleSavePlace = (placeId: string) => {
    setSavedPlaceIds((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
    );
  };

  const handleQuotaError = (errorMsg: string) => {
    setQuotaAlertInfo({
      isOpen: true,
      message: errorMsg,
    });
  };

  const handleOpenDirections = (place?: Place) => {
    const targetPlace = place || places[1] || places[0]; // Default to first place or restaurant
    setDirectionsDestPlace(targetPlace);
    setIsDirectionsOpen(true);
    setDirectionsError(null);

    // If destination is Hotel Welco itself, origin is Narita Airport. Otherwise, origin is Hotel Welco!
    const isDestWelco = targetPlace.id === 'narita-welco-hotel';
    const defaultOrigin = isDestWelco
      ? {
          name: '✈️ 나리타공항 제1터미널',
          lat: 35.7652,
          lng: 140.3863,
        }
      : {
          name: '🏨 [내 숙소] 호텔 웰코 나리타',
          lat: 35.7766,
          lng: 140.3155,
        };

    const destPoint = {
      name: targetPlace.name,
      lat: targetPlace.lat,
      lng: targetPlace.lng,
    };

    handleRequestRoute(defaultOrigin, destPoint, 'TRANSIT');
  };

  const handleRequestRoute = async (
    origin: LocationPoint,
    destination: LocationPoint,
    mode: TravelMode
  ) => {
    setIsDirectionsLoading(true);
    setDirectionsError(null);

    try {
      const google = (window as any).google;
      if (google?.maps?.DirectionsService) {
        const directionsService = new google.maps.DirectionsService();
        const googleTravelMode =
          mode === 'TRANSIT'
            ? google.maps.TravelMode.TRANSIT
            : mode === 'WALKING'
            ? google.maps.TravelMode.WALKING
            : google.maps.TravelMode.DRIVING;

        directionsService.route(
          {
            origin: { lat: origin.lat, lng: origin.lng },
            destination: { lat: destination.lat, lng: destination.lng },
            travelMode: googleTravelMode,
          },
          (result: any, status: string) => {
            if (status === 'OK' && result) {
              setDirectionsResponse(result);
            } else {
              setDirectionsResponse(null);
            }
          }
        );
      }

      const res = await fetchGoogleDirections(origin, destination, mode);
      setRouteResult(res);
      setIsDirectionsLoading(false);
    } catch (err: any) {
      setIsDirectionsLoading(false);
      setDirectionsError(err.message || '경로를 계산하지 못했습니다.');
    }
  };

  const handleClearRoute = () => {
    setDirectionsResponse(null);
    setRouteResult(null);
    setDirectionsError(null);
  };

  // Determine current map center & zoom based on selected region
  const { currentCenter, currentZoom } = useMemo(() => {
    const regionObj = REGIONS.find((r) => r.id === selectedRegion) || REGIONS[0];
    return {
      currentCenter: regionObj.center,
      currentZoom: regionObj.zoom,
    };
  }, [selectedRegion]);

  // Dynamic place filtering
  const filteredPlaces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return places.filter((place) => {
      // 1. Saved filter
      if (isSavedOnly && !savedPlaceIds.includes(place.id)) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'my_stay') {
          if (place.id !== 'narita-welco-hotel' && place.category !== 'my_stay') {
            return false;
          }
        } else if (selectedCategory === 'narita_special') {
          if (place.category !== 'narita_special' && place.region !== 'narita') {
            return false;
          }
        } else if (place.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Region filter
      if (selectedRegion !== 'all') {
        if (place.region !== selectedRegion) {
          return false;
        }
      }

      // 4. Search query filter
      if (query) {
        const matchesName = place.name.toLowerCase().includes(query);
        const matchesJa = place.nameJa.toLowerCase().includes(query);
        const matchesEn = place.nameEn.toLowerCase().includes(query);
        const matchesDesc = place.description.toLowerCase().includes(query);
        const matchesTags = place.tags.some((t) => t.toLowerCase().includes(query));
        const matchesAddress = place.address.toLowerCase().includes(query);
        const matchesHighlights = place.highlights.some((h) => h.toLowerCase().includes(query));

        if (
          !matchesName &&
          !matchesJa &&
          !matchesEn &&
          !matchesDesc &&
          !matchesTags &&
          !matchesAddress &&
          !matchesHighlights
        ) {
          return false;
        }
      }

      return true;
    });
  }, [places, selectedCategory, selectedRegion, searchQuery, isSavedOnly, savedPlaceIds]);

  // Compute counts per category for the badge counters
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: places.length };

    places.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
      if (p.id === 'narita-welco-hotel') {
        counts['my_stay'] = (counts['my_stay'] || 0) + 1;
      }
      if (p.region === 'narita') {
        counts['narita_special'] = (counts['narita_special'] || 0) + 1;
      }
    });

    return counts as Record<CategoryId, number>;
  }, [places]);

  const handleSelectPlace = (place: Place | null) => {
    setSelectedPlace(place);
  };

  const handleOpenDetails = (place: Place) => {
    setDetailPlace(place);
  };

  return (
    <div className="app-container">
      {/* Top Floating Bar */}
      <div className="top-nav-layer">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenTransitModal={() => setIsTransitModalOpen(true)}
          onOpenDirections={() => handleOpenDirections()}
          onToggleSavedOnly={() => setIsSavedOnly(!isSavedOnly)}
          isSavedOnly={isSavedOnly}
          savedCount={savedPlaceIds.length}
        />

        <CategoryChips
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            setSelectedPlace(null);
          }}
          categoryCounts={categoryCounts}
        />

        <RegionSelector
          selectedRegion={selectedRegion}
          onSelectRegion={(regId) => {
            setSelectedRegion(regId);
            setSelectedPlace(null);
          }}
        />
      </div>

      {/* Sidebar with Place List & Details */}
      <Sidebar
        places={filteredPlaces}
        selectedPlace={selectedPlace}
        savedPlaceIds={savedPlaceIds}
        isSavedOnly={isSavedOnly}
        onSelectPlace={handleSelectPlace}
        onToggleSave={toggleSavePlace}
        onOpenDetails={handleOpenDetails}
        onOpenDirections={(p) => handleOpenDirections(p)}
      />

      {/* Directions Panel */}
      <DirectionsPanel
        isOpen={isDirectionsOpen}
        places={places}
        destinationPlace={directionsDestPlace}
        onClose={() => setIsDirectionsOpen(false)}
        onRequestRoute={handleRequestRoute}
        routeResult={routeResult}
        isLoading={isDirectionsLoading}
        errorMessage={directionsError}
        onClearRoute={handleClearRoute}
      />

      {/* Main Map View (Google Maps or Leaflet Fallback) */}
      <div style={{ flex: 1, height: '100%', position: 'relative' }}>
        {mapProvider === 'google' && googleApiKey ? (
          <GoogleMapComponent
            apiKey={googleApiKey}
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={(p) => {
              setSelectedPlace(p);
              if (p) setDetailPlace(p);
            }}
            center={currentCenter}
            zoom={currentZoom}
            directionsResponse={directionsResponse}
            onQuotaOrAuthError={handleQuotaError}
          />
        ) : (
          <MapComponent
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={(p) => {
              setSelectedPlace(p);
              if (p) setDetailPlace(p);
            }}
            center={currentCenter}
            zoom={currentZoom}
          />
        )}

        {/* Map Engine Switcher & Safe Indicator Badge */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #cbd5e1',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
              fontSize: '12px',
              fontWeight: 700,
              color: mapProvider === 'google' ? '#1d4ed8' : '#0f172a',
              cursor: 'pointer',
            }}
            title="지도 엔진 설정"
          >
            <Layers size={14} color={mapProvider === 'google' ? '#2563eb' : '#64748b'} />
            <span>{mapProvider === 'google' ? 'Google Maps 연동' : 'OpenStreetMap (무료)'}</span>
            <ShieldCheck size={13} color="#16a34a" />
          </button>
        </div>

        {/* Floating Quick Navigation buttons on the map */}
        <div className="map-floating-actions">
          <button
            className="floating-btn"
            onClick={() => {
              setSelectedRegion('narita');
              setSelectedPlace(null);
            }}
            title="나리타 공항권으로 이동"
          >
            <Plane size={18} color="#ec4899" />
          </button>
          <button
            className="floating-btn"
            onClick={() => {
              setSelectedRegion('ueno_asakusa');
              setSelectedPlace(null);
            }}
            title="도쿄 도심(우에노)으로 이동"
          >
            <Navigation size={18} color="#2563eb" />
          </button>
          <button
            className="floating-btn"
            onClick={() => {
              setSelectedRegion('all');
              setSelectedPlace(null);
            }}
            title="전체 지도 보기"
          >
            <Compass size={18} color="#0f172a" />
          </button>
        </div>
      </div>

      {/* Place Detail Modal */}
      <PlaceDetailModal
        place={detailPlace}
        isSaved={detailPlace ? savedPlaceIds.includes(detailPlace.id) : false}
        onClose={() => setDetailPlace(null)}
        onToggleSave={() => detailPlace && toggleSavePlace(detailPlace.id)}
        onOpenDirections={(p) => handleOpenDirections(p)}
      />

      {/* Narita ↔ Tokyo Transit Comparison Modal */}
      <TransitModal
        isOpen={isTransitModalOpen}
        onClose={() => setIsTransitModalOpen(false)}
      />

      {/* Quota & Billing Safeguard Alert Modal */}
      <QuotaAlertModal
        isOpen={quotaAlertInfo.isOpen}
        errorMessage={quotaAlertInfo.message}
        onClose={() => setQuotaAlertInfo({ isOpen: false, message: '' })}
        onSwitchToFallback={() => setMapProvider('leaflet')}
      />

      {/* Map Engine Settings Modal (No raw API key displayed) */}
      <MapSettingsModal
        isOpen={isSettingsModalOpen}
        mapProvider={mapProvider}
        hasApiKey={Boolean(googleApiKey)}
        onClose={() => setIsSettingsModalOpen(false)}
        onToggleProvider={(provider) => setMapProvider(provider)}
      />
    </div>
  );
}

export default App;
