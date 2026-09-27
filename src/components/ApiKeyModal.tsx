import React, { useState } from 'react';
import { X, Key, ShieldCheck, Check, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  currentApiKey: string;
  onClose: () => void;
  onSaveApiKey: (newKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  currentApiKey,
  onClose,
  onSaveApiKey,
}) => {
  const [inputKey, setInputKey] = useState(currentApiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
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
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
              }}
            >
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>
                Google Maps API 키 설정 및 과금 방지
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                월 $200 무료 크레딧 안에서 안전하게 사용하기
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
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
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
              Google Maps JavaScript API Key
            </label>
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '13.5px',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              💡 키를 입력하면 즉시 공식 Google Maps 및 도쿄 지하철 대중교통 노선망이 활성화됩니다.
            </p>
          </div>

          {/* Safe Alert Guide Box */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              border: '1px solid #bbf7d0',
              fontSize: '12.5px',
              color: '#166534',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#16a34a" />
              무료 초과 과금 방지(Alert) 3단계 안전장치:
            </div>
            <div style={{ lineHeight: 1.5, color: '#14532d' }}>
              1. <strong>구글 클라우드 예산 알림(Budget Alert)</strong>: 콘솔에서 $1 또는 $50 예산 설정 시 도달할 때 이메일 알림<br />
              2. <strong>일일 할당량(Quota) 제한</strong>: 1일 지도 호출을 500회 등으로 제한하여 초과 과금 완전 차단<br />
              3. <strong>앱 내 자동 Fallback</strong>: 할당량 소진 시 자동으로 무료 OpenStreetMap으로 전환
            </div>
          </div>

          {/* Quick Help link */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
            <a
              href="https://console.cloud.google.com/google/maps-apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <ExternalLink size={13} />
              구글 클라우드 콘솔에서 API 키 만들기 바로가기
            </a>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              color: '#475569',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              backgroundColor: savedSuccess ? '#16a34a' : '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {savedSuccess ? <Check size={16} /> : null}
            {savedSuccess ? '적용 완료' : '키 저장 & 지도 전환'}
          </button>
        </div>
      </div>
    </div>
  );
};
