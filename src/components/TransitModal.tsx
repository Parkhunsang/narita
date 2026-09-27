import React from 'react';
import { TRANSIT_COMPARISONS } from '../data/placesData';
import { X, Train, DollarSign, Clock, CheckCircle2, Lightbulb } from 'lucide-react';

interface TransitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransitModal: React.FC<TransitModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
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
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Train size={22} color="#38bdf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                나리타 공항 ↔ 도쿄 도심 특급 교통 가이드
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                목적지(숙소 위치)와 예산에 맞게 최적의 이동 수단을 선택하세요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
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

        {/* Content list */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Quick Choice Recommendation */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#eff6ff',
              borderRadius: '14px',
              border: '1px solid #bfdbfe',
              fontSize: '13px',
              color: '#1e40af',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <Lightbulb size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>💡 30초 요약 가이드:</strong>
              <div style={{ marginTop: '4px', lineHeight: 1.5 }}>
                • <strong>우에노 / 아사쿠사 / 아키하바라</strong> 이동 시: <strong>스카이라이너</strong> (압도적 속도)
                <br />
                • <strong>신주쿠 / 시부야 / 시나가와</strong> 이동 시: <strong>N'EX 나리타 익스프레스</strong> (환승 0번 직통)
                <br />
                • <strong>긴자 / 니혼바시</strong> 저렴하게 가려면: <strong>게이세이 액세스 특급</strong>
              </div>
            </div>
          </div>

          {/* Cards for each transit mode */}
          {TRANSIT_COMPARISONS.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '18px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {/* Card top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                    {item.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    backgroundColor: item.badgeColor,
                    color: '#ffffff',
                  }}
                >
                  {item.badge}
                </span>
              </div>

              {/* Route & Times */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '8px',
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                }}
              >
                <div>
                  <div style={{ color: '#64748b', fontSize: '11px' }}>주요 구간</div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.route}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Clock size={11} /> 소요 시간
                  </div>
                  <div style={{ fontWeight: 700, color: '#2563eb' }}>{item.time}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <DollarSign size={11} /> 운임 요금
                  </div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.cost}</div>
                </div>
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12.5px', color: '#475569' }}>
                {item.features.map((feat, fIdx) => (
                  <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={13} color="#10b981" style={{ flexShrink: 0 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Ticket purchase tip */}
              <div
                style={{
                  fontSize: '12px',
                  color: '#b45309',
                  backgroundColor: '#fffbeb',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  marginTop: '4px',
                }}
              >
                📌 <strong>예매 꿀팁:</strong> {item.ticketTip}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'right',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
