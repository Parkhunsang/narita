import React, { useState, useEffect } from 'react';
import type { Place } from '../types/place';
import type { TravelMode, LocationPoint, RouteResult } from '../types/directions';
import { PRESET_ORIGINS } from '../types/directions';
import { 
  X, 
  ArrowUpDown, 
  Train, 
  Footprints, 
  Car, 
  Navigation, 
  Clock, 
  Milestone, 
  ExternalLink, 
  AlertCircle
} from 'lucide-react';

interface DirectionsPanelProps {
  isOpen: boolean;
  places: Place[];
  destinationPlace: Place | null;
  onClose: () => void;
  onRequestRoute: (
    origin: LocationPoint,
    destination: LocationPoint,
    mode: TravelMode
  ) => void;
  routeResult: RouteResult | null;
  isLoading: boolean;
  errorMessage: string | null;
  onClearRoute: () => void;
}

export const DirectionsPanel: React.FC<DirectionsPanelProps> = ({
  isOpen,
  places,
  destinationPlace,
  onClose,
  onRequestRoute,
  routeResult,
  isLoading,
  errorMessage,
  onClearRoute,
}) => {
  const [selectedOriginIndex, setSelectedOriginIndex] = useState(0); // Default to Narita Airport T1
  const [selectedDestId, setSelectedDestId] = useState<string>(
    destinationPlace?.id || places[0]?.id || ''
  );
  const [travelMode, setTravelMode] = useState<TravelMode>('TRANSIT');

  // Update destination if destinationPlace prop changes
  useEffect(() => {
    if (destinationPlace) {
      setSelectedDestId(destinationPlace.id);
    }
  }, [destinationPlace]);

  if (!isOpen) return null;

  const currentOrigin = PRESET_ORIGINS[selectedOriginIndex] || PRESET_ORIGINS[0];
  const currentDestPlace = places.find((p) => p.id === selectedDestId) || places[0];

  const handleSearchRoute = () => {
    if (!currentOrigin || !currentDestPlace) return;

    const destPoint: LocationPoint = {
      name: currentDestPlace.name,
      lat: currentDestPlace.lat,
      lng: currentDestPlace.lng,
    };

    onRequestRoute(currentOrigin, destPoint, travelMode);
  };

  const handleSwap = () => {
    // If destination matches a preset or can be swapped
    const matchOriginIdx = PRESET_ORIGINS.findIndex(
      (o) => o.name.includes(currentDestPlace?.name.slice(0, 3) || 'xyz')
    );
    if (matchOriginIdx >= 0) {
      setSelectedOriginIndex(matchOriginIdx);
    }
  };

  return (
    <div
      className="directions-panel"
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        width: '420px',
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100vh - 32px)',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.25), 0 4px 12px rgba(0,0,0,0.08)',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        animation: 'modalSlideUp 0.2s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={18} color="#38bdf8" />
          <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
            도쿄-나리타 실시간 길찾기
          </h3>
        </div>
        <button
          onClick={() => {
            onClearRoute();
            onClose();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Mode Selector (Transit / Walk / Drive) */}
      <div
        style={{
          display: 'flex',
          padding: '12px 16px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          gap: '8px',
        }}
      >
        <button
          onClick={() => setTravelMode('TRANSIT')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 0',
            borderRadius: '10px',
            border: travelMode === 'TRANSIT' ? '2px solid #2563eb' : '1px solid #cbd5e1',
            backgroundColor: travelMode === 'TRANSIT' ? '#eff6ff' : '#ffffff',
            color: travelMode === 'TRANSIT' ? '#1d4ed8' : '#64748b',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Train size={15} />
          대중교통
        </button>
        <button
          onClick={() => setTravelMode('WALKING')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 0',
            borderRadius: '10px',
            border: travelMode === 'WALKING' ? '2px solid #2563eb' : '1px solid #cbd5e1',
            backgroundColor: travelMode === 'WALKING' ? '#eff6ff' : '#ffffff',
            color: travelMode === 'WALKING' ? '#1d4ed8' : '#64748b',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Footprints size={15} />
          도보
        </button>
        <button
          onClick={() => setTravelMode('DRIVING')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 0',
            borderRadius: '10px',
            border: travelMode === 'DRIVING' ? '2px solid #2563eb' : '1px solid #cbd5e1',
            backgroundColor: travelMode === 'DRIVING' ? '#eff6ff' : '#ffffff',
            color: travelMode === 'DRIVING' ? '#1d4ed8' : '#64748b',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Car size={15} />
          차량/택시
        </button>
      </div>

      {/* Origin & Destination Inputs */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
            <span style={{ width: '2px', height: '32px', backgroundColor: '#cbd5e1', margin: '4px 0' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Origin Dropdown */}
            <div>
              <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                출발지
              </label>
              <select
                value={selectedOriginIndex}
                onChange={(e) => setSelectedOriginIndex(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                {PRESET_ORIGINS.map((origin, idx) => (
                  <option key={idx} value={idx}>
                    {origin.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Dropdown */}
            <div>
              <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                도착지
              </label>
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                {places.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name} ({place.region === 'narita' ? '나리타' : '도쿄'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
            title="출발/도착 바꾸기"
          >
            <ArrowUpDown size={16} />
          </button>
        </div>

        {/* Search Route Button */}
        <button
          onClick={handleSearchRoute}
          disabled={isLoading}
          style={{
            marginTop: '4px',
            width: '100%',
            padding: '11px 0',
            backgroundColor: isLoading ? '#93c5fd' : '#2563eb',
            color: '#ffffff',
            borderRadius: '12px',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: isLoading ? 'wait' : 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          {isLoading ? (
            <span>경로 및 최적 환승 계산 중...</span>
          ) : (
            <>
              <Navigation size={16} />
              <span>실시간 경로 및 최적 환승 찾기</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div
          style={{
            margin: '0 16px 12px',
            padding: '10px 14px',
            backgroundColor: '#fef2f2',
            borderRadius: '10px',
            border: '1px solid #fee2e2',
            color: '#b91c1c',
            fontSize: '12.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Route Results Box */}
      {routeResult && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Summary Banner */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#eff6ff',
              borderRadius: '14px',
              border: '1px solid #bfdbfe',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e40af', fontSize: '12px' }}>
                <Clock size={14} />
                <span>총 소요 예상 시간</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#1d4ed8' }}>
                {routeResult.duration}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '12px' }}>
                <Milestone size={14} />
                <span>이동 거리</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                {routeResult.distance}
              </div>
            </div>
          </div>

          {/* Step by Step Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '4px 0 2px' }}>
              환승 및 이동 단계 ({routeResult.steps.length}단계)
            </h4>

            {routeResult.steps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12.5px',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: step.travelMode === 'TRANSIT' ? '#2563eb' : '#64748b',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {step.travelMode === 'TRANSIT' ? <Train size={13} /> : <Footprints size={13} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{ color: '#0f172a', fontWeight: 600, lineHeight: 1.4 }}
                    dangerouslySetInnerHTML={{ __html: step.instruction }}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px', fontSize: '11.5px', color: '#64748b' }}>
                    <span>⏱ {step.duration}</span>
                    <span>• {step.distance}</span>
                    {step.transitDetails && (
                      <span style={{ color: '#2563eb', fontWeight: 600 }}>
                        ({step.transitDetails.lineName} · {step.transitDetails.numStops}개 정거장)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Links */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <a
              href={routeResult.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 0',
                borderRadius: '10px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                fontSize: '12.5px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
              }}
            >
              <ExternalLink size={14} />
              구글 지도 앱에서 실시간 내비 실행
            </a>

            <button
              onClick={onClearRoute}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#64748b',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              경로 초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
