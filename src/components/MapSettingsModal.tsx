import React from 'react';
import { X, ShieldCheck, Map, Layers } from 'lucide-react';

interface MapSettingsModalProps {
  isOpen: boolean;
  mapProvider: 'google' | 'leaflet';
  hasApiKey: boolean;
  onClose: () => void;
  onToggleProvider: (provider: 'google' | 'leaflet') => void;
}

export const MapSettingsModal: React.FC<MapSettingsModalProps> = ({
  isOpen,
  mapProvider,
  hasApiKey,
  onClose,
  onToggleProvider,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 22px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
              }}
            >
              <Layers size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>지도 엔진 및 보안 설정</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                API 키는 보안을 위해 화면에 절대 노출되지 않습니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Security Protection Banner */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <ShieldCheck size={20} color="#16a34a" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>
                API 키 보안 보호 활성화됨
              </div>
              <div style={{ fontSize: '12px', color: '#15803d', marginTop: '2px' }}>
                API 키는 로컬 환경설정(<code>.env.local</code>)을 통해 비공개로만 안전하게 처리되며 화면에 절대 노출되지 않습니다.
              </div>
            </div>
          </div>

          {/* Engine Choice */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '8px' }}>
              사용할 지도 엔진 선택
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Google Maps Option */}
              <button
                disabled={!hasApiKey}
                onClick={() => onToggleProvider('google')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: mapProvider === 'google' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: mapProvider === 'google' ? '#eff6ff' : '#ffffff',
                  cursor: hasApiKey ? 'pointer' : 'not-allowed',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  opacity: hasApiKey ? 1 : 0.5,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                  <Map size={14} color="#2563eb" />
                  Google Maps
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  도쿄 지하철·철도 노선망 표시
                </div>
              </button>

              {/* OpenStreetMap Option */}
              <button
                onClick={() => onToggleProvider('leaflet')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: mapProvider === 'leaflet' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: mapProvider === 'leaflet' ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                  <Layers size={14} color="#10b981" />
                  OpenStreetMap
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  완전 무료 오픈소스 지도
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 22px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'right',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '7px 18px',
              borderRadius: '8px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
