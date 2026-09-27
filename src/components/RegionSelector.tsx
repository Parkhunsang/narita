import React from 'react';
import { REGIONS } from '../data/placesData';
import type { RegionId } from '../types/place';
import { MapPin } from 'lucide-react';

interface RegionSelectorProps {
  selectedRegion: RegionId;
  onSelectRegion: (regionId: RegionId) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegion,
  onSelectRegion,
}) => {
  return (
    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
      {REGIONS.map((region) => {
        const isActive = selectedRegion === region.id;
        return (
          <button
            key={region.id}
            onClick={() => onSelectRegion(region.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: isActive ? '#2563eb' : 'rgba(255,255,255,0.92)',
              color: isActive ? '#ffffff' : '#334155',
              border: isActive ? '1px solid #1d4ed8' : '1px solid #e2e8f0',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.15s ease',
            }}
          >
            <MapPin size={12} style={{ opacity: isActive ? 1 : 0.6 }} />
            {region.label}
          </button>
        );
      })}
    </div>
  );
};
