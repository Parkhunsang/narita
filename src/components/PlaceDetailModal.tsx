import React, { useState } from 'react';
import type { Place } from '../types/place';
import { X, Star, Clock, MapPin, Copy, Check, ExternalLink, Bookmark, Sparkles } from 'lucide-react';

interface PlaceDetailModalProps {
  place: Place | null;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: () => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  isSaved,
  onClose,
  onToggleSave,
}) => {
  const [copied, setCopied] = useState(false);

  if (!place) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(place.addressJa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Modal Header Image */}
        <div style={{ position: 'relative', height: '240px', width: '100%', flexShrink: 0 }}>
          <img
            src={place.imageUrl}
            alt={place.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 60%)',
            }}
          />

          {/* Close & Bookmark floating buttons */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              display: 'flex',
              gap: '8px',
            }}
          >
            <button
              onClick={onToggleSave}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: isSaved ? '#ec4899' : 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
              title={isSaved ? '저장됨' : '찜하기'}
            >
              <Bookmark
                size={18}
                color={isSaved ? '#ffffff' : '#334155'}
                fill={isSaved ? '#ffffff' : 'none'}
              />
            </button>
            <button
              onClick={onClose}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                color: '#334155',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Title on Image */}
          <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  fontSize: '12px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 600,
                }}
              >
                {place.region === 'narita' ? '✈️ 나리타' : '🗼 도쿄'}
              </span>
              <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Star size={13} fill="#fbbf24" color="#fbbf24" /> {place.rating} ({place.reviewCount.toLocaleString()})
              </span>
              <span style={{ fontSize: '12px', color: '#ffffff', opacity: 0.8 }}>· {place.priceLevel}</span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {place.name}
            </h2>
            <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '2px' }}>
              {place.nameJa} ({place.nameEn})
            </p>
          </div>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Transit Advice Box */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#eff6ff',
              borderRadius: '12px',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Clock size={18} color="#2563eb" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1d4ed8' }}>이동 팁</div>
              <div style={{ fontSize: '13.5px', color: '#1e3a8a', fontWeight: 500 }}>
                {place.transitTip}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              장소 소개
            </h4>
            <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
              {place.description}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#e11d48" /> 핵심 포인트
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {place.highlights.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13.5px',
                    color: '#475569',
                    backgroundColor: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '8px',
                  }}
                >
                  <span style={{ color: '#2563eb', fontWeight: 700 }}>•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Table */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '14px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              fontSize: '13px',
            }}
          >
            {/* Address with copy */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <MapPin size={16} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ color: '#0f172a', fontWeight: 600 }}>{place.address}</div>
                  <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>{place.addressJa}</div>
                </div>
              </div>
              <button
                onClick={handleCopyAddress}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 9px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                  color: copied ? '#16a34a' : '#475569',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? '복사됨' : '일본어 주소'}</span>
              </button>
            </div>

            {/* Operating Hours */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <Clock size={16} color="#64748b" style={{ flexShrink: 0 }} />
              <div>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>영업시간: </span>
                <span style={{ color: '#334155' }}>{place.businessHours}</span>
                {place.closedDay && (
                  <span style={{ color: '#ef4444', marginLeft: '6px' }}>({place.closedDay})</span>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {place.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 500,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer with Google Maps Link */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #f1f5f9',
            backgroundColor: '#ffffff',
            display: 'flex',
            gap: '12px',
          }}
        >
          <a
            href={place.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 0',
              borderRadius: '12px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              transition: 'background 0.15s ease',
            }}
          >
            <ExternalLink size={16} />
            구글 지도에서 실시간 길찾기
          </a>
        </div>
      </div>
    </div>
  );
};
