import React from 'react';
import type { Place } from '../types/place';
import { Star, Clock, Bookmark, ExternalLink, Navigation } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  isSelected: boolean;
  isSaved: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
  onOpenDetails: () => void;
  onOpenDirections?: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  isSelected,
  isSaved,
  onSelect,
  onToggleSave,
  onOpenDetails,
  onOpenDirections,
}) => {
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
        boxShadow: isSelected
          ? '0 10px 25px -5px rgba(37, 99, 235, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      {/* Card Image Banner */}
      <div style={{ position: 'relative', height: '140px', width: '100%', overflow: 'hidden' }}>
        <img
          src={place.imageUrl}
          alt={place.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
          }}
        />

        {/* Region & Price Badge */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
          <span
            style={{
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              fontWeight: 600,
            }}
          >
            {place.region === 'narita' ? '✈️ 나리타' : '🗼 도쿄'}
          </span>
          <span
            style={{
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#0f172a',
              fontWeight: 700,
            }}
          >
            {place.priceLevel}
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: isSaved ? '#ec4899' : 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.15s ease',
          }}
          title={isSaved ? '저장 취소' : '장소 찜하기'}
        >
          <Bookmark
            size={16}
            color={isSaved ? '#ffffff' : '#475569'}
            fill={isSaved ? '#ffffff' : 'none'}
          />
        </button>

        {/* Rating overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#ffffff',
          }}
        >
          <Star size={14} fill="#fbbf24" color="#fbbf24" />
          <span style={{ fontSize: '13px', fontWeight: 700 }}>{place.rating}</span>
          <span style={{ fontSize: '11px', opacity: 0.85 }}>({place.reviewCount.toLocaleString()})</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
            {place.name}
          </h3>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            {place.nameJa} · {place.nameEn}
          </p>
        </div>

        {/* Transit Tip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11.5px',
            color: '#1d4ed8',
            backgroundColor: '#eff6ff',
            padding: '5px 8px',
            borderRadius: '6px',
            fontWeight: 500,
          }}
        >
          <Clock size={12} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {place.transitTip}
          </span>
        </div>

        <p
          style={{
            fontSize: '12.5px',
            color: '#475569',
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {place.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
          {place.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '11px',
                padding: '2px 7px',
                borderRadius: '4px',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Card Action Buttons */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            style={{
              flex: 1,
              padding: '7px 0',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            상세 보기
          </button>

          {onOpenDirections && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDirections(place);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '7px 10px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              title="이 장소까지 길찾기"
            >
              <Navigation size={12} />
              길찾기
            </button>
          )}

          <a
            href={place.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '7px 10px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              color: '#64748b',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: 600,
              border: '1px solid #e2e8f0',
              transition: 'background 0.15s ease',
            }}
            title="구글 지도 바로가기"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};
