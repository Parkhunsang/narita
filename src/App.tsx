import { useState, useEffect, useMemo } from 'react';
import { PLACES_DATA, REGIONS } from './data/placesData';
import type { Place, CategoryId, RegionId } from './types/place';
import { MapComponent } from './components/MapComponent';
import { SearchBar } from './components/SearchBar';
import { CategoryChips } from './components/CategoryChips';
import { RegionSelector } from './components/RegionSelector';
import { Sidebar } from './components/Sidebar';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { TransitModal } from './components/TransitModal';
import { Plane, Compass, Navigation } from 'lucide-react';

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
        if (selectedCategory === 'narita_special') {
          // Narita special category
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
      {/* Top Floating Bar (Search, Category Chips, and Region Quick Jumps) */}
      <div className="top-nav-layer">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenTransitModal={() => setIsTransitModalOpen(true)}
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
      />

      {/* Main Map View */}
      <div style={{ flex: 1, height: '100%', position: 'relative' }}>
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

      {/* Detail Modal */}
      <PlaceDetailModal
        place={detailPlace}
        isSaved={detailPlace ? savedPlaceIds.includes(detailPlace.id) : false}
        onClose={() => setDetailPlace(null)}
        onToggleSave={() => detailPlace && toggleSavePlace(detailPlace.id)}
      />

      {/* Narita ↔ Tokyo Transit Comparison Modal */}
      <TransitModal
        isOpen={isTransitModalOpen}
        onClose={() => setIsTransitModalOpen(false)}
      />
    </div>
  );
}

export default App;
