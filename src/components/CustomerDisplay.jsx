import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const IconStore = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const IconBox = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>;
const IconPower = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>;

const CustomerDisplay = () => {
  const [data, setData] = useState({ 
    cart: [], 
    total: 0, 
    store_name: 'Luma POS', 
    welcome_text: 'Selamat Datang' , 
    is_dark: true, 
    primary_color: '#6366f1', 
    is_customer_display_on: true, 
    customerViewMode: 'cart', 
    products: [],
    showReceipt: false,
    lastTransaction: null,
    store_address: '',
    cashierName: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const fetchSettings = async () => {
    const { data: s, error } = await supabase.from('settings').select('*').single();
    if (!error && s) {
      setData(prev => ({
        ...prev,
        store_name: s.store_name,
        store_address: s.store_address,
        welcome_text: s.welcome_text,
        primary_color: s.primary_color,
        is_dark: true, // Standardized to dark for premium feel
        is_customer_display_on: s.is_customer_display_on
      }));
    }
  };

  useEffect(() => {
    fetchSettings();

    const channel = new BroadcastChannel('customer_display');
    channel.onmessage = (event) => setData(prev => ({ ...prev, ...event.data }));

    // Real-time Settings Sync
    const settingsSub = supabase
      .channel('customer_settings_sync')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings' }, (payload) => {
        const s = payload.new;
        setData(prev => ({
          ...prev,
          store_name: s.store_name,
          store_address: s.store_address,
          welcome_text: s.welcome_text,
          primary_color: s.primary_color,
          is_customer_display_on: s.is_customer_display_on
        }));
      })
      .subscribe();

    // Prevent Refresh and Context Menu
    const preventRefresh = (e) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.metaKey && e.key === 'r')) {
        e.preventDefault();
      }
    };
    const preventContextMenu = (e) => e.preventDefault();

    window.addEventListener('keydown', preventRefresh);
    window.addEventListener('contextmenu', preventContextMenu);

    return () => {
      channel.close();
      supabase.removeChannel(settingsSub);
      window.removeEventListener('keydown', preventRefresh);
      window.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  // Apply Theme to Customer Screen
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', data.primary_color);
    root.style.setProperty('--primary-soft', `${data.primary_color}15`);
    if (data.is_dark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [data.primary_color, data.is_dark]);

  if (data.is_customer_display_on === false) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        height: '100vh', 
        width: '100vw', 
        background: '#050505', 
        zIndex: 999999,
        cursor: 'none',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        gap: '2.5rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <style>
          {`
            @keyframes pulse-slow {
              0%, 100% { opacity: 0.1; transform: scale(5); }
              50% { opacity: 0.3; transform: scale(5.2); }
            }
          `}
        </style>
        <div style={{
          animation: 'pulse-slow 3s infinite ease-in-out',
          color: 'var(--primary, #6366f1)'
        }}>
          <IconPower />
        </div>
        <div style={{
          fontSize: '2rem', 
          fontWeight: 900, 
          letterSpacing: '0.6em', 
          opacity: 0.2,
          textTransform: 'uppercase',
          textAlign: 'center',
          marginLeft: '0.6em' // offset letter spacing for center
        }}>
          Layar Dinonaktifkan
        </div>
        <div style={{
          position: 'absolute',
          bottom: '4rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{fontSize: '0.9rem', fontWeight: 600, opacity: 0.1, letterSpacing: '0.1em'}}>
            {data.store_name}
          </div>
          {data.cashierName && (
            <div style={{fontSize: '0.75rem', fontWeight: 700, opacity: 0.05, textTransform: 'uppercase'}}>
              KASIR: {data.cashierName}
            </div>
          )}
        </div>
      </div>
    );
  }


  if (data.showReceipt && data.lastTransaction) {
    return (
      <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', padding: '4rem'}}>
        <div style={{background: 'white', color: 'black', width: '500px', padding: '4rem', borderRadius: '48px', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.3)', textAlign: 'center', fontFamily: 'monospace'}}>
          <h2 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem'}}>{data.store_name}</h2>
          <p style={{fontSize: '1rem', color: '#666', marginBottom: '3rem'}}>{data.store_address}</p>
          
          <div style={{textAlign: 'left', borderTop: '2px dashed #eee', borderBottom: '2px dashed #eee', padding: '2rem 0', margin: '2rem 0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1rem', color: '#888'}}>
              <span>ID Transaksi:</span>
              <span>#transaction-{data.lastTransaction.id}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1rem', color: '#888'}}>
              <span>Nama Customer:</span>
              <span>{data.lastTransaction.customerName}<span style={{color: '#aaa', fontFamily: 'monospace'}}>#{data.lastTransaction.id?.slice(0,4).toUpperCase()}</span></span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1rem', color: '#888'}}>
              <span>Waktu:</span>
              <span>{new Date(data.lastTransaction.timestamp).toLocaleString()}</span>
            </div>
            
            {data.lastTransaction.items?.map((item, idx) => (
              <div key={idx} style={{marginBottom: '1rem'}}>
                <div style={{fontWeight: 800, fontSize: '1.2rem'}}>{item.name}</div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem'}}>
                  <span>{item.qty} x {item.price.toLocaleString()}</span>
                  <span>{(item.qty * item.price).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{textAlign: 'right', gap: '1rem', display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontSize: '1.2rem', fontWeight: 600}}>TOTAL:</span>
              <span style={{fontWeight: 900, fontSize: '3rem', color: 'var(--primary)'}}>Rp {(data.lastTransaction?.total || 0).toLocaleString()}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: '#666'}}>
              <span>Metode Bayar:</span>
              <span style={{fontWeight: 700}}>{data.lastTransaction.payment_method}</span>
            </div>
          </div>

          <div style={{marginTop: '4rem', fontSize: '1.2rem', fontWeight: 700, opacity: 0.5}}>
            TERIMA KASIH ATAS KUNJUNGANNYA
          </div>
        </div>
      </div>
    );
  }

  if (data.showQRIS) {
    return (
      <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', padding: '4rem'}}>
        <div style={{
          background: 'var(--bg-card)', 
          padding: '4rem', 
          borderRadius: '48px', 
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-main)', 
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem'
        }}>
          <div>
            <h2 style={{fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem'}}>Pembayaran QRIS</h2>
            <p style={{fontSize: '1.5rem', color: 'var(--text-muted)'}}>Silahkan scan kode QR di bawah untuk membayar</p>
          </div>

          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div style={{
               background: '#fff',
               width: '300px',
               height: '300px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               borderRadius: '16px',
               overflow: 'hidden',
               border: '1px solid #eee'
            }}>
               {data.isLoadingQR ? (
                 <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
                   <div className="spinner-primary"></div>
                   <span style={{fontSize: '0.9rem', color: '#666', fontWeight: 600}}>Generating QR...</span>
                 </div>
               ) : (
                 <img 
                   src={(data.qrisData && data.qrisData.startsWith('http')) ? data.qrisData : `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data.qrisData || 'READY')}`} 
                   alt="QRIS" 
                   style={{width: '95%', height: '95%', objectFit: 'contain'}} 
                 />
               )}
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
               <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS Logo" style={{height: '40px'}} />
            </div>
          </div>
          <style>
            {`
              .spinner-primary {
                width: 40px;
                height: 40px;
                border: 4px solid var(--primary-soft);
                border-top: 4px solid var(--primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>

          <div style={{width: '100%', padding: '2rem', background: 'var(--primary-soft)', borderRadius: '24px', border: '2px solid var(--primary)'}}>
            <div style={{fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>Total yang harus dibayar</div>
            <div style={{fontSize: '4.5rem', fontWeight: 900, color: 'var(--primary)'}}>Rp {(data.total || 0).toLocaleString()}</div>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '1.2rem'}}>
             <div className="pulse-primary" style={{width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%'}}></div>
             Menunggu Konfirmasi Pembayaran...
          </div>
        </div>
        <style>
          {`
            .pulse-primary {
              animation: pulse-dot 1.5s infinite ease-in-out;
            }
            @keyframes pulse-dot {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.5); opacity: 0.5; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}
        </style>
      </div>
    );
  }

  if (data.customerViewMode === 'menu') {
    const categories = ['Semua', ...new Set(data.products.flatMap(p => (p.category || 'Lainnya').split(',').map(c => c.trim())))];

    return (
      <div className="pos-layout" style={{height: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)'}}>
        <header style={{
          marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--bg-card)', padding: '1.5rem 2.5rem', borderRadius: '24px',
          boxShadow: 'var(--shadow-main)', border: '1px solid var(--border)'
        }}>
          <div>
            <h1 style={{fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0}}>{data.store_name}</h1>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, margin: '0.2rem 0 0 0'}}>{data.welcome_text}</p>
          </div>
          <div style={{background: 'var(--primary)', padding: '0.8rem 1.5rem', borderRadius: '12px', color: 'white'}}>
            <h2 style={{fontSize: '1rem', margin: 0, fontWeight: 700}}>Menu {data.store_name}</h2>
          </div>
        </header>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap'}}>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.8rem 1.5rem', 
                background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-card)', 
                color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                borderRadius: '12px', 
                fontWeight: 700, 
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', overflowY: 'auto', alignContent: 'start'}} className="hide-scrollbar">
          {(() => {
            const filtered = data.products.filter(p => selectedCategory === 'Semua' || (p.category && p.category.split(',').map(c => c.trim()).includes(selectedCategory)));
            
            if (filtered.length === 0) {
              return (
                <div style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.2,
                  gap: '1rem',
                  padding: '5rem 0'
                }}>
                  <div style={{transform: 'scale(3)'}}>
                    <IconBox />
                  </div>
                  <h2 style={{fontSize: '1.5rem', fontWeight: 800}}>Belum Ada Menu Tersedia</h2>
                </div>
              );
            }

            return filtered.map(p => (
              <div key={p.id} style={{
                background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '20px', 
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-main)',
                display: 'flex', flexDirection: 'column', gap: '0.8rem'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                  <div style={{
                    width: '44px', height: '44px', background: 'var(--primary-soft)', borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 800, flexShrink: 0
                  }}>
                    {p.name.charAt(0)}
                  </div>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3}}>{p.name}</div>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600}}>{p.category}</div>
                  </div>
                </div>
                {p.variants && (
                  <div style={{display: 'flex', gap: '0.4rem', flexWrap: 'wrap'}}>
                    {p.variants.split(',').map((v, i) => (
                      <span key={i} style={{
                        background: 'var(--primary-soft)', color: 'var(--primary)', fontWeight: 700,
                        padding: '3px 10px', borderRadius: '8px', fontSize: '0.7rem'
                      }}>{v.trim()}</span>
                    ))}
                  </div>
                )}
                <div style={{fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary)', marginTop: 'auto'}}>
                  Rp {p.price.toLocaleString()}
                </div>
              </div>
            ));
          })()}
        </div>

      </div>
    );
  }

  return (
    <div className="pos-layout" style={{height: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)'}}>
      <header style={{
        marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--bg-card)', padding: '1.5rem 2.5rem', borderRadius: '24px',
        boxShadow: 'var(--shadow-main)', border: '1px solid var(--border)'
      }}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0}}>{data.store_name}</h1>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.2rem'}}>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, margin: 0}}>{data.welcome_text}</p>
            {data.cashierName && (
              <span style={{
                background: 'var(--primary-soft)', color: 'var(--primary)', 
                padding: '0.2rem 0.6rem', borderRadius: '8px', 
                fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase'
              }}>
                Kasir: {data.cashierName}
              </span>
            )}
          </div>
        </div>
        <div style={{
          textAlign: 'right', background: 'var(--primary)', padding: '0.8rem 1.5rem', 
          borderRadius: '16px', color: 'white', 
          boxShadow: `0 10px 20px -5px ${data.themeColor}66`,
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <p style={{fontSize: '0.7rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem', margin: 0}}>Pelanggan</p>
          <h2 style={{fontSize: '1.2rem', fontWeight: 800, margin: 0}}>{data.customerName || 'UMUM'}</h2>
        </div>
      </header>

      <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        {data.cart.length === 0 ? (
          <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.15}}>
            <div style={{transform: 'scale(3)', marginBottom: '2rem'}}>
              <IconStore />
            </div>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginTop: 0}}>Menunggu Pesanan...</h2>
          </div>
        ) : (
          data.cart.map((item, idx) => (
            <div key={`${item.id}-${idx}`} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '1.2rem 1.5rem', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-main)'}}>
              <div>
                <div style={{fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)'}}>
                  {item.name}
                  {item.selectedVariant && <span style={{fontSize: '0.9rem', color: 'var(--primary)', marginLeft: '0.5rem'}}>({item.selectedVariant})</span>}
                </div>
                <div style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>{item.qty} x Rp {item.price.toLocaleString()}</div>
              </div>
              <div style={{fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)'}}>
                Rp {(item.price * item.qty).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      <footer style={{marginTop: '2rem', background: 'var(--bg-card)', padding: '1.5rem 2.5rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', boxShadow: 'var(--shadow-main)'}}>
        <span style={{fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)'}}>Total Bayar</span>
        <span style={{fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)'}}>Rp {(data.total || 0).toLocaleString()}</span>
      </footer>
    </div>
  );
};

export default CustomerDisplay;
