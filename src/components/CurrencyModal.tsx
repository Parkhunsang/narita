import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Calculator, Percent, Users, Coins, ArrowRightLeft } from 'lucide-react';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({ isOpen, onClose }) => {
  // 1 JPY to KRW rate (Default fallback: 8.95 KRW per 1 JPY, or 895 KRW per 100 JPY)
  const [jpyToKrw, setJpyToKrw] = useState<number>(8.85);
  const [lastUpdated, setLastUpdated] = useState<string>('실시간 조회 중...');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculator inputs
  const [jpyInput, setJpyInput] = useState<string>('1000');
  const [krwInput, setKrwInput] = useState<string>('8850');
  const [activeInput, setActiveInput] = useState<'jpy' | 'krw'>('jpy');

  // Tax free toggle (10% tax in Japan)
  const [isTaxFree, setIsTaxFree] = useState<boolean>(false);

  // Split bill
  const [splitCount, setSplitCount] = useState<number>(2);

  // Fetch live exchange rate
  const fetchRate = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/JPY');
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates && data.rates.KRW) {
          const rate = data.rates.KRW;
          setJpyToKrw(rate);
          const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
          setLastUpdated(`오늘 ${time} 기준`);
          return rate;
        }
      }
    } catch (e) {
      console.warn('Live exchange rate fetch failed, using fallback', e);
    } finally {
      setIsRefreshing(false);
    }
    return jpyToKrw;
  };

  useEffect(() => {
    if (isOpen) {
      fetchRate();
    }
  }, [isOpen]);

  // Recalculate when activeInput or rate changes
  useEffect(() => {
    const numJpy = parseFloat(jpyInput) || 0;
    if (activeInput === 'jpy') {
      const calculatedKrw = Math.round(numJpy * jpyToKrw);
      setKrwInput(calculatedKrw ? calculatedKrw.toLocaleString() : '0');
    }
  }, [jpyInput, jpyToKrw, activeInput]);

  if (!isOpen) return null;

  const currentJpyNumber = parseFloat(jpyInput.replace(/,/g, '')) || 0;

  // Tax free: If tax is included (10%), tax-free price is Price / 1.10
  const taxFreeJpy = isTaxFree ? Math.round(currentJpyNumber / 1.1) : currentJpyNumber;
  const taxSavingsJpy = isTaxFree ? currentJpyNumber - taxFreeJpy : 0;
  const taxFreeKrw = Math.round(taxFreeJpy * jpyToKrw);

  // Split bill calculations
  const splitJpy = Math.round(taxFreeJpy / splitCount);
  const splitKrw = Math.round(taxFreeKrw / splitCount);

  const handleJpyChange = (val: string) => {
    setActiveInput('jpy');
    const clean = val.replace(/[^0-9]/g, '');
    setJpyInput(clean);
  };

  const handleKrwChange = (val: string) => {
    setActiveInput('krw');
    const clean = val.replace(/[^0-9]/g, '');
    setKrwInput(clean);
    const numKrw = parseFloat(clean) || 0;
    const calculatedJpy = Math.round(numKrw / jpyToKrw);
    setJpyInput(calculatedJpy ? calculatedJpy.toString() : '0');
  };

  const handleAddYen = (amount: number) => {
    setActiveInput('jpy');
    const current = parseFloat(jpyInput) || 0;
    setJpyInput((current + amount).toString());
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '92vh',
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
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
              }}
            >
              <Coins size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>
                실시간 엔화(JPY) 환율 계산기
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                100엔 = 약 {(jpyToKrw * 100).toFixed(1)}원 ({lastUpdated})
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={fetchRate}
              disabled={isRefreshing}
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
              title="실시간 환율 새로고침"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
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
        </div>

        {/* Body */}
        <div style={{ padding: '22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Main Currency Input Box */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '18px',
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
            }}
          >
            {/* JPY Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  일본 엔화 (JPY)
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>현지 가격 입력</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: activeInput === 'jpy' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  padding: '10px 14px',
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginRight: '8px' }}>¥</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={jpyInput}
                  onChange={(e) => handleJpyChange(e.target.value)}
                  placeholder="0"
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '22px',
                    fontWeight: 800,
                    width: '100%',
                    color: '#0f172a',
                    fontFamily: 'monospace',
                  }}
                />
              </div>
            </div>

            {/* Quick JPY Add Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[100, 500, 1000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAddYen(amt)}
                  style={{
                    padding: '5px 9px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  +{amt.toLocaleString()}엔
                </button>
              ))}
              <button
                onClick={() => {
                  setJpyInput('0');
                  setKrwInput('0');
                }}
                style={{
                  padding: '5px 9px',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  backgroundColor: '#fff1f2',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#e11d48',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                }}
              >
                초기화
              </button>
            </div>

            {/* Swap Divider */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              <div style={{ padding: '0 8px', color: '#94a3b8' }}>
                <ArrowRightLeft size={16} />
              </div>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            </div>

            {/* KRW Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  대한민국 원화 (KRW)
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>환산 원화 금액</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: activeInput === 'krw' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  padding: '10px 14px',
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb', marginRight: '8px' }}>₩</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={krwInput}
                  onChange={(e) => handleKrwChange(e.target.value)}
                  placeholder="0"
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '22px',
                    fontWeight: 800,
                    width: '100%',
                    color: '#2563eb',
                    fontFamily: 'monospace',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Tax Free 10% Toggle */}
          <div
            onClick={() => setIsTaxFree(!isTaxFree)}
            style={{
              padding: '14px 16px',
              backgroundColor: isTaxFree ? '#fdf2f8' : '#f8fafc',
              borderRadius: '14px',
              border: isTaxFree ? '1px solid #f472b6' : '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: isTaxFree ? '#ec4899' : '#e2e8f0',
                  color: isTaxFree ? '#ffffff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Percent size={18} />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                  소비세 10% 면세(Tax-Free) 적용
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  돈키호테/백화점 등에서 5,500엔 이상 결제 시
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backgroundColor: isTaxFree ? '#ec4899' : '#cbd5e1',
                  color: '#ffffff',
                }}
              >
                {isTaxFree ? '면세 적용됨' : '미적용'}
              </span>
            </div>
          </div>

          {/* Tax Free Result Box if enabled */}
          {isTaxFree && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#fdf2f8',
                borderRadius: '12px',
                fontSize: '12.5px',
                color: '#9d174d',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                면세 가격: <strong>¥{taxFreeJpy.toLocaleString()}</strong> (약 ₩{taxFreeKrw.toLocaleString()})
              </div>
              <div>
                절약 금액: <strong>¥{taxSavingsJpy.toLocaleString()}</strong>
              </div>
            </div>
          )}

          {/* Split Bill (N빵) Calculator */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: '#f8fafc',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                <Users size={16} color="#2563eb" />
                <span>더치페이 (N빵) 계산</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {[2, 3, 4, 5].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setSplitCount(cnt)}
                    style={{
                      padding: '4px 9px',
                      borderRadius: '6px',
                      border: splitCount === cnt ? '1px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: splitCount === cnt ? '#eff6ff' : '#ffffff',
                      color: splitCount === cnt ? '#1d4ed8' : '#475569',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {cnt}명
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                backgroundColor: '#eff6ff',
                borderRadius: '10px',
                color: '#1e40af',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600 }}>1인당 부담 금액 ({splitCount}인 기준)</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1d4ed8' }}>
                  ¥{splitJpy.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600 }}>
                  (약 ₩{splitKrw.toLocaleString()})
                </div>
              </div>
            </div>
          </div>

          {/* Quick Price Cheat Sheet */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calculator size={14} color="#64748b" /> 도쿄 여행 물가 체감표
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '12px',
              }}
            >
              <div style={{ padding: '8px 10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div style={{ color: '#64748b' }}>편의점 음료/삼각김밥</div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>¥150 ~ ¥220 (약 1,500원)</div>
              </div>
              <div style={{ padding: '8px 10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div style={{ color: '#64748b' }}>라멘 / 돈카츠 한 끼</div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>¥1,000 ~ ¥1,500 (약 10,000원)</div>
              </div>
              <div style={{ padding: '8px 10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div style={{ color: '#64748b' }}>나리타 스카이라이너 편도</div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>¥2,570 (약 22,700원)</div>
              </div>
              <div style={{ padding: '8px 10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div style={{ color: '#64748b' }}>돈키호테 면세 최소금액</div>
                <div style={{ fontWeight: 700, color: '#e11d48' }}>¥5,500 이상 (세포함)</div>
              </div>
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
              padding: '8px 20px',
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
