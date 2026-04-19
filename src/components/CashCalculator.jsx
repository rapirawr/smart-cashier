import React, { useState, useEffect, useRef } from 'react';
import { Banknote, Check, Delete } from 'lucide-react';

function CashCalculator({ total, onConfirm, onClose }) {
  const [cashInput, setCashInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e) => {
      if (e.key >= '0' && e.key <= '9') handleKeypad(e.key);
      if (e.key === 'Backspace') handleKeypad('⌫');
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') handleSubmit();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cashInput, total]); // dependencies needed for handleSubmit and handleKeypad

  const cashAmount = parseInt(cashInput) || 0;
  const change = cashAmount - total;

  const quickAmounts = [
    { label: 'Uang Pas', value: total },
    { label: '10.000', value: 10000 },
    { label: '20.000', value: 20000 },
    { label: '50.000', value: 50000 },
    { label: '100.000', value: 100000 },
    { label: '200.000', value: 200000 },
  ];

  const handleKeypad = (val) => {
    if (val === 'C') {
      setCashInput('');
    } else if (val === '⌫') {
      setCashInput(prev => prev.slice(0, -1));
    } else {
      setCashInput(prev => prev + val);
    }
  };

  const handleSubmit = () => {
    if (change >= 0) {
      onConfirm(cashAmount, change);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{width: '480px', padding: '2.5rem'}} onClick={e => e.stopPropagation()}>
        <h2 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'}}>
          <Banknote /> Pembayaran Cash
        </h2>
        <p style={{textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem'}}>
          Masukkan nominal uang yang diberikan
        </p>

        {/* Total Display */}
        <div style={{
          background: 'var(--primary-soft)', border: '2px solid var(--primary)',
          borderRadius: '16px', padding: '1.2rem', marginBottom: '1.5rem', textAlign: 'center'
        }}>
          <div style={{fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase'}}>Total yang harus dibayar</div>
          <div style={{fontSize: '2rem', fontWeight: 900, color: 'var(--primary)'}}>Rp {total.toLocaleString()}</div>
        </div>

        {/* Cash Input */}
        <div style={{marginBottom: '1rem'}}>
          <div style={{
            background: 'var(--bg-app)', border: '2px solid var(--border)',
            borderRadius: '16px', padding: '1.2rem', display: 'flex', alignItems: 'center',
            gap: '0.5rem', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'monospace'
          }}>
            <span style={{color: 'var(--text-muted)', fontSize: '1.2rem'}}>Rp</span>
            <input
              ref={inputRef}
              type="text"
              value={cashInput ? parseInt(cashInput).toLocaleString() : ''}
              readOnly
              placeholder="0"
              style={{
                flex: 1, border: 'none', background: 'transparent',
                fontSize: '1.8rem', fontWeight: 800, fontFamily: 'monospace',
                color: 'var(--text-main)', outline: 'none', textAlign: 'right',
                boxShadow: 'none'
              }}
            />
          </div>
        </div>

        {/* Quick Amounts */}
        <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem'}}>
          {quickAmounts.map(q => (
            <button key={q.label}
              className="cash-calc-btn quick"
              onClick={() => setCashInput(String(q.value))}
              style={{flex: '1 1 auto', minWidth: '80px'}}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Keypad */}
        <div className="cash-calc-grid" style={{marginBottom: '1.5rem'}}>
          {['1','2','3','4','5','6','7','8','9','C','0','⌫'].map(key => (
            <button key={key} className="cash-calc-btn"
              onClick={() => handleKeypad(key)}
              style={{
                ...(key === 'C' ? {background: 'var(--danger-soft)', color: 'var(--danger)', borderColor: 'var(--danger)'} : {}),
                ...(key === '⌫' ? {background: 'var(--warning-soft)', color: 'var(--warning)', borderColor: 'var(--warning)'} : {})
              }}
            >
              {key === '⌫' ? <Delete size={20} /> : key}
            </button>
          ))}
        </div>

        {/* Change Display */}
        {cashAmount > 0 && (
          <div style={{
            background: change >= 0 ? 'var(--success-soft)' : 'var(--danger-soft)',
            border: `2px solid ${change >= 0 ? 'var(--success)' : 'var(--danger)'}`,
            borderRadius: '16px', padding: '1.2rem', marginBottom: '1.5rem',
            textAlign: 'center', animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{fontSize: '0.8rem', fontWeight: 700, color: change >= 0 ? 'var(--success)' : 'var(--danger)', textTransform: 'uppercase'}}>
              {change >= 0 ? 'Kembalian' : 'Uang Kurang'}
            </div>
            <div style={{fontSize: '2.5rem', fontWeight: 900, color: change >= 0 ? 'var(--success)' : 'var(--danger)'}}>
              Rp {Math.abs(change).toLocaleString()}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{display: 'flex', gap: '1rem'}}>
          <button onClick={onClose} className="btn btn-soft" style={{flex: 1, padding: '1.2rem'}}>BATAL</button>
          <button
            onClick={handleSubmit}
            disabled={change < 0 || cashAmount === 0}
            className="btn btn-primary"
            style={{
              flex: 2, padding: '1.2rem', fontSize: '1.05rem',
              opacity: (change < 0 || cashAmount === 0) ? 0.5 : 1,
              cursor: (change < 0 || cashAmount === 0) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            <Check size={20} /> KONFIRMASI PEMBAYARAN
          </button>
        </div>
      </div>
    </div>
  );
}

export default CashCalculator;
