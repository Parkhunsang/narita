import React from 'react';
import { Search, X, Train, Bookmark } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenTransitModal: () => void;
  onToggleSavedOnly: () => void;
  isSavedOnly: boolean;
  savedCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenTransitModal,
  onToggleSavedOnly,
  isSavedOnly,
  savedCount,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
      }}
    >
      {/* Search Input Box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          borderRadius: '999px',
          padding: '8px 16px',
          boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.12), 0 2px 6px -1px rgba(15, 23, 42, 0.06)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        <Search size={18} color="#64748b" style={{ marginRight: '10px', flexShrink: 0 }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="장소, 라멘, 스카이라이너, 오모테산도 검색..."
          style={{
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            width: '100%',
            color: '#0f172a',
            backgroundColor: 'transparent',
            fontWeight: 500,
          }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              color: '#94a3b8',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Transit Guide Quick Button */}
      <button
        onClick={onOpenTransitModal}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 14px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '999px',
          border: 'none',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
        title="나리타 ↔ 도쿄 특급 이동 비교 (스카이라이너 vs 넥스 vs 버스)"
      >
        <Train size={16} color="#38bdf8" />
        <span className="hide-on-very-small">공항교통</span>
      </button>

      {/* Saved Places Toggle Button */}
      <button
        onClick={onToggleSavedOnly}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '10px 14px',
          backgroundColor: isSavedOnly ? '#ec4899' : 'rgba(255, 255, 255, 0.98)',
          color: isSavedOnly ? '#ffffff' : '#475569',
          borderRadius: '999px',
          border: isSavedOnly ? 'none' : '1px solid #e2e8f0',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
        title="내가 찜한 장소 모아보기"
      >
        <Bookmark size={15} fill={isSavedOnly ? '#ffffff' : 'none'} color={isSavedOnly ? '#ffffff' : '#64748b'} />
        <span>찜</span>
        {savedCount > 0 && (
          <span
            style={{
              fontSize: '11px',
              backgroundColor: isSavedOnly ? '#be185d' : '#f1f5f9',
              color: isSavedOnly ? '#ffffff' : '#0f172a',
              padding: '1px 6px',
              borderRadius: '999px',
              fontWeight: 700,
            }}
          >
            {savedCount}
          </span>
        )}
      </button>
    </div>
  );
};
