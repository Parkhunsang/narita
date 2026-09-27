import React, { useState } from 'react';
import type { Place } from '../types/place';
import { PlaceCard } from './PlaceCard';
import { ChevronLeft, ChevronRight, SlidersHorizontal, BookmarkCheck } from 'lucide-react';

interface SidebarProps {
  places: Place[];
  selectedPlace: Place | null;
  savedPlaceIds: string[];
  isSavedOnly: boolean;
  onSelectPlace: (place: Place) => void;
  onToggleSave: (placeId: string) => void;
  onOpenDetails: (place: Place) => void;
  onOpenDirections?: (place: Place) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  places,
  selectedPlace,
  savedPlaceIds,
  isSavedOnly,
  onSelectPlace,
  onToggleSave,
  onOpenDetails,
  onOpenDirections,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Toggle Button for Desktop Floating Sidebar */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="sidebar-toggle-btn"
        style={{
          position: 'absolute',
          top: '20px',
          left: isCollapsed ? '16px' : '410px',
          zIndex: 1100,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          color: '#334155',
        }}
        title={isCollapsed ? '사이드바 열기' : '사이드바 접기'}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Main Sidebar Container */}
      <aside
        className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '400px',
          backgroundColor: '#ffffff',
          boxShadow: '4px 0 24px rgba(15, 23, 42, 0.08)',
          zIndex: 1050,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isCollapsed ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        {/* Sidebar Header Space (to accommodate top floating search bar) */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '124px', // Space for top floating search bar & category chips
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isSavedOnly ? (
              <BookmarkCheck size={18} color="#ec4899" />
            ) : (
              <SlidersHorizontal size={18} color="#2563eb" />
            )}
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
              {isSavedOnly ? '내가 찜한 장소' : '장소 검색 결과'}
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#2563eb',
                backgroundColor: '#eff6ff',
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              {places.length}개
            </span>
          </div>

          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            나리타 ↔ 도쿄
          </span>
        </div>

        {/* Scrollable Places List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {places.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#64748b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}
              >
                🔍
              </div>
              <h4 style={{ fontSize: '16px', color: '#0f172a', fontWeight: 600 }}>
                {isSavedOnly ? '찜한 장소가 아직 없습니다' : '조건에 맞는 장소가 없습니다'}
              </h4>
              <p style={{ fontSize: '13px', lineHeight: 1.5 }}>
                {isSavedOnly
                  ? '마음에 드는 장소의 북마크 아이콘을 눌러 저장해보세요!'
                  : '다른 카테고리를 선택하거나 검색어를 변경해보세요.'}
              </p>
            </div>
          ) : (
            places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isSelected={selectedPlace?.id === place.id}
                isSaved={savedPlaceIds.includes(place.id)}
                onSelect={() => onSelectPlace(place)}
                onToggleSave={() => onToggleSave(place.id)}
                onOpenDetails={() => onOpenDetails(place)}
                onOpenDirections={onOpenDirections}
              />
            ))
          )}
        </div>
      </aside>
    </>
  );
};
