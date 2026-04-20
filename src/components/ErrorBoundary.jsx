import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical POS Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh', width: '100vw', background: '#020617', color: 'white',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', textAlign: 'center', fontFamily: 'Outfit, sans-serif'
        }}>
          <div style={{
            width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '2rem', color: '#ef4444'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h1 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem'}}>Ups! Terjadi Kesalahan Sistem</h1>
          <p style={{color: 'rgba(255,255,255,0.6)', maxWidth: '500px', lineHeight: 1.6, marginBottom: '2.5rem'}}>
            Aplikasi mengalami kendala teknis yang tidak terduga. Silakan coba muat ulang aplikasi atau hubungi teknisi.
          </p>
          <div style={{display: 'flex', gap: '1rem'}}>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '1rem 2rem', background: '#6366f1', color: 'white', 
                border: 'none', borderRadius: '16px', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)'
              }}
            >
              Muat Ulang Aplikasi
            </button>
          </div>
          <div style={{marginTop: '4rem', opacity: 0.8, fontSize: '0.8rem', fontFamily: 'monospace'}}>
            {this.state.error && this.state.error.toString()}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
