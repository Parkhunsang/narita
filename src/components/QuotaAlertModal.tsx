import React from 'react';
import { AlertTriangle, ShieldAlert, ExternalLink, RefreshCw } from 'lucide-react';

interface QuotaAlertModalProps {
  isOpen: boolean;
  errorMessage: string;
  onClose: () => void;
  onSwitchToFallback: () => void;
}

export const QuotaAlertModal: React.FC<QuotaAlertModalProps> = ({
  isOpen,
  errorMessage,
  onClose,
  onSwitchToFallback,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.25)',
          border: '1px solid #fee2e2',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#fef2f2',
            borderBottom: '1px solid #fee2e2',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
            }}
          >
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#991b1b', margin: 0 }}>
              ⚠️ 구글맵 API 무료 한도 / 인증 알림
            </h3>
            <p style={{ fontSize: '12.5px', color: '#b91c1c', margin: 0 }}>
              과금 방지 보호 장치가 작동 중입니다
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              fontSize: '13.5px',
              color: '#334155',
              lineHeight: 1.6,
              backgroundColor: '#f8fafc',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
            }}
          >
            <strong>발생 내용:</strong>
            <div style={{ marginTop: '4px', color: '#b91c1c', fontWeight: 500 }}>
              {errorMessage || '구글맵 API 사용량이 초과되었거나 API 키 설정이 올바르지 않습니다.'}
            </div>
          </div>

          <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
            <h4 style={{ fontSize: '13.5px', color: '#0f172a', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={15} color="#f59e0b" /> 무료 $200 초과 과금 방지 조치 안내:
            </h4>
            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>
                <strong>Google Cloud 결제 알림(Budget Alert)</strong>을 설정해두시면 50%, 90%, 100% 도달 시 이메일로 즉시 알림이 발송됩니다.
              </li>
              <li>
                앱에서는 API 오류 발생 시 <strong>즉시 안전한 무료 대체 지도(OpenStreetMap)</strong>로 전환하여 앱이 멈추지 않도록 보호합니다.
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
          }}
        >
          <a
            href="https://console.cloud.google.com/billing"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#475569',
              fontSize: '12.5px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={14} />
            구글 클라우드 콘솔 확인
          </a>

          <button
            onClick={() => {
              onSwitchToFallback();
              onClose();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            무료 대체 지도로 전환
          </button>
        </div>
      </div>
    </div>
  );
};
