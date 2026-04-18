import React, { useState, useEffect, useCallback } from 'react'
import { db, seedDatabase } from './db'
import * as XLSX from 'xlsx'
import './App.css'

// Premium Icon Components
const IconStore = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const IconBox = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>;
const IconSettings = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
const IconHistory = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="9" /></svg>;
const IconUsers = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M17.31 7a4 4 0 0 0-4.34 0" /></svg>;
const IconMoon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>;
const IconSun = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>;
const IconPower = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>;
const IconPrinter = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>;
const IconTag = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
const IconCreditCard = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>;
const IconAlert = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
const IconQR = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><line x1="7" y1="7" x2="7.01" y2="7" /><line x1="17" y1="7" x2="17.01" y2="7" /><line x1="17" y1="17" x2="17.01" y2="17" /><line x1="7" y1="17" x2="7.01" y2="17" /></svg>;
const IconMenu = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;

const CustomerBoard = () => {
  const [data, setData] = useState({ 
    cart: [], 
    total: 0, 
    storeName: 'Smart Cashier', 
    welcomeText: 'Selamat Datang' , 
    isDark: false, 
    themeColor: '#6366f1', 
    isCustomerDisplayOn: true, 
    customerViewMode: 'cart', 
    products: [],
    showReceipt: false,
    lastTransaction: null,
    storeAddress: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    const channel = new BroadcastChannel('customer_display');
    channel.onmessage = (event) => setData(event.data);

    // Prevent Refresh and Context Menu
    const preventRefresh = (e) => {
      // F5, Ctrl+R, Cmd+R
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.metaKey && e.key === 'r')) {
        e.preventDefault();
      }
    };
    const preventContextMenu = (e) => e.preventDefault();

    window.addEventListener('keydown', preventRefresh);
    window.addEventListener('contextmenu', preventContextMenu);

    return () => {
      channel.close();
      window.removeEventListener('keydown', preventRefresh);
      window.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  // Apply Theme to Customer Screen
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', data.themeColor);
    root.style.setProperty('--primary-soft', `${data.themeColor}15`);
    if (data.isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [data.themeColor, data.isDark]);

  if (data.isCustomerDisplayOn === false) {
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
          fontSize: '0.9rem',
          fontWeight: 600,
          opacity: 0.1,
          letterSpacing: '0.1em'
        }}>
          {data.storeName}
        </div>
      </div>
    );
  }


  if (data.showReceipt && data.lastTransaction) {
    return (
      <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', padding: '4rem'}}>
        <div style={{background: 'white', color: 'black', width: '500px', padding: '4rem', borderRadius: '48px', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.3)', textAlign: 'center', fontFamily: 'monospace'}}>
          <h2 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem'}}>{data.storeName}</h2>
          <p style={{fontSize: '1rem', color: '#666', marginBottom: '3rem'}}>{data.storeAddress}</p>
          
          <div style={{textAlign: 'left', borderTop: '2px dashed #eee', borderBottom: '2px dashed #eee', padding: '2rem 0', margin: '2rem 0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1rem', color: '#888'}}>
              <span>ID Transaksi:</span>
              <span>#POS-{data.lastTransaction.id}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1rem', color: '#888'}}>
              <span>Nama Customer:</span>
              <span>{data.lastTransaction.customerName}</span>
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
              <span style={{fontWeight: 900, fontSize: '3rem', color: 'var(--primary)'}}>Rp {data.lastTransaction.total.toLocaleString()}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: '#666'}}>
              <span>Metode Bayar:</span>
              <span style={{fontWeight: 700}}>{data.lastTransaction.paymentMethod}</span>
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
          boxShadow: 'var(--shadow-premium)', 
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
            <p style={{fontSize: '1.5rem', color: 'var(--text-muted)'}}>Silakan scan kode QR di bawah untuk membayar</p>
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
                   src={data.qrisData.startsWith('http') ? data.qrisData : `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data.qrisData || 'READY')}`} 
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
            <div style={{fontSize: '4.5rem', fontWeight: 900, color: 'var(--primary)'}}>Rp {data.total.toLocaleString()}</div>
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
    const categories = ['Semua', ...new Set(data.products.map(p => p.category || 'Lainnya'))];

    return (
      <div className="pos-premium-layout" style={{height: '100vh', padding: '4rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)'}}>
        <header style={{marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)'}}>{data.storeName}</h1>
            <p style={{fontSize: '1.5rem', color: 'var(--text-muted)'}}>Daftar Menu Kami / Our Menu</p>
          </div>
          <div style={{background: 'var(--primary)', padding: '1rem 2rem', borderRadius: '16px', color: 'white'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 700}}>Menu {data.storeName}</h2>
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

        <div style={{flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', overflowY: 'auto'}} className="hide-scrollbar">
          {data.products
            .filter(p => selectedCategory === 'Semua' || p.category === selectedCategory)
            .map(p => (
              <div key={p.id} style={{background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
                <div style={{width: '80px', height: '80px', background: 'var(--primary-soft)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--primary)', fontWeight: 800}}>
                  {p.name.charAt(0)}
                </div>
                <div>
                  <div style={{fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)'}}>{p.name}</div>
                  <div style={{fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>{p.category}</div>
                  <div style={{fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)'}}>Rp {p.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pos-premium-layout" style={{height: '100vh', padding: '4rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)'}}>
      <header style={{marginBottom: '3rem', borderBottom: '2px solid var(--border)', paddingBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <h1 style={{fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)'}}>{data.storeName}</h1>
          <p style={{fontSize: '1.5rem', color: 'var(--text-muted)'}}>{data.welcomeText}</p>
        </div>
        <div style={{textAlign: 'right', background: 'var(--primary)', padding: '1rem 2rem', borderRadius: '16px', color: 'white', boxShadow: `0 10px 15px -3px ${data.themeColor}55`}}>
          <p style={{fontSize: '1rem', fontWeight: 600, opacity: 0.8, marginBottom: '0.25rem'}}></p>
          <h2 style={{fontSize: '2rem', fontWeight: 800}}>{data.customerName || ''}</h2>
        </div>
      </header>

      <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
        {data.cart.length === 0 ? (
          <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.15}}>
            <div style={{transform: 'scale(5)', marginBottom: '4rem'}}>
              <IconStore />
            </div>
            <h2 style={{fontSize: '2rem', fontWeight: 600, marginTop: '2rem'}}>Menunggu Pesanan...</h2>
          </div>
        ) : (
          data.cart.map(item => (
            <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)'}}>
              <div>
                <div style={{fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)'}}>{item.name}</div>
                <div style={{fontSize: '1.5rem', color: 'var(--text-muted)'}}>{item.qty} x Rp {item.price.toLocaleString()}</div>
              </div>
              <div style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)'}}>
                Rp {(item.price * item.qty).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      <footer style={{marginTop: '3rem', background: 'var(--bg-card)', padding: '3rem', borderRadius: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', boxShadow: 'var(--shadow-premium)'}}>
        <span style={{fontSize: '2rem', fontWeight: 600, color: 'var(--text-main)'}}>Total Bayar</span>
        <span style={{fontSize: '5rem', fontWeight: 900, color: 'var(--primary)'}}>Rp {data.total.toLocaleString()}</span>
      </footer>
    </div>
  );
};

function App() {
  const [settings, setSettings] = useState({
    storeName: 'Store Name',
    storeAddress: 'Store Address',
    taxRate: 11,
    memberDiscount: 5,
    themeColor: '#6366f1',
    isCustomerDisplayOn: true,
    welcomeText: 'Selamat Datang / Welcome' ,
    qrisImage: ''
  });

  const [products, setProducts] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'pos');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [lastTransaction, setLastTransaction] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [activeTransactionId, setActiveTransactionId] = useState(null);
  const [qrisData, setQrisData] = useState(''); 
  // Untuk menyimpan string/URL QRIS asli
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const [customerViewMode, setCustomerViewMode] = useState('cart');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchSettings = useCallback(async () => {
    const all = await db.settings.toArray();
    const config = {
      storeName: 'Smart Cashier',
      storeAddress: 'Jl. Utama No. 123',
      taxRate: 11,
      memberDiscount: 5,
      themeColor: '#6366f1',
      isCustomerDisplayOn: true,
      welcomeText: 'Selamat Datang / Welcome',
      qrisImage: ''
    };
    all.forEach(s => config[s.key] = s.value);
    setSettings(config);
  }, []);

  const updateSetting = useCallback(async (key, value) => {
    await db.settings.put({ key, value });
    fetchSettings();
  }, [fetchSettings]);

  const fetchProducts = useCallback(async () => {
    const all = await db.products.toArray();
    setProducts(all);
  }, []);

  const fetchMembers = useCallback(async () => {
    const all = await db.members.toArray();
    setMembers(all);
  }, []);

  const fetchTransactions = useCallback(async () => {
    const all = await db.transactions.reverse().toArray();
    setTransactions(all);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);
  
  // Checkout Session State
  const [customerName, setCustomerName] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [activeMember, setActiveMember] = useState(null);
  const [checkoutKey, setCheckoutKey] = useState(0);

  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

  // RGB state untuk theme color picker
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 99, g: 102, b: 241 };
  };
  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(v => Math.min(255, Math.max(0, parseInt(v) || 0)).toString(16).padStart(2, '0')).join('');
  const [rgb, setRgb] = useState(() => hexToRgb(localStorage.getItem('themeColor') || '#6366f1'));
  const isRgbUserChange = React.useRef(false);

  // 1. Terapkan warna ke CSS Variable secara real-time
  useEffect(() => {
    const root = document.documentElement;
    const color = rgbToHex(rgb.r, rgb.g, rgb.b);
    root.style.setProperty('--primary', color);
    root.style.setProperty('--primary-soft', `${color}15`);
  }, [rgb]);

  // 2. Simpan ke database jika perubahan berasal dari user
  useEffect(() => {
    if (!isRgbUserChange.current) return;
    isRgbUserChange.current = false;
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    updateSetting('themeColor', hex);
  }, [rgb, updateSetting]);

  // 3. Sinkronisasi dari Settings (saat load pertama)
  useEffect(() => {
    if (settings.themeColor) {
      const newRgb = hexToRgb(settings.themeColor);
      setRgb(prev => {
        if (prev.r === newRgb.r && prev.g === newRgb.g && prev.b === newRgb.b) return prev;
        return newRgb;
      });
    }
  }, [settings.themeColor]);

  // 4. Sinkronisasi Dark Mode
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  

  const [formData, setFormData] = useState({ name: '', price: '', stock: '' });
  const [memberFormData, setMemberFormData] = useState({ name: '', phone: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = ['Semua', ...new Set(products.map(p => p.category || 'Lainnya'))];


  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(i => i.qty > 0));
  }, []);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    await db.products.update(editingProduct.id, {
      name: editingProduct.name,
      price: parseInt(editingProduct.price),
      stock: parseInt(editingProduct.stock)
    });
    setEditingProduct(null);
    fetchProducts();
    alert('Produk berhasil diperbarui!');
    window.location.reload();
  };

  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const taxAmount = subtotal * (parseInt(settings.taxRate) / 100);
  const discount = activeMember ? subtotal * (parseInt(settings.memberDiscount) / 100) : 0;
  const total = subtotal + taxAmount - discount;

  const handleCheckout = useCallback(async () => {
    if (cart.length === 0 || isProcessing) return;
    setIsProcessing(true);
    
    // Jika bayar menggunakan QRIS dan modal QRIS belum muncul, tampilkan modal dulu
    if (paymentMethod === 'QRIS' && !showQRISModal) {
      setShowQRISModal(true);
      setIsProcessing(false);
      return;
    }

    try {
      // Simpan transaksi
      const newTransaction = { 
        timestamp: new Date().toISOString(), 
        total, 
        customerName: customerName || 'Umum',
        memberId: activeMember ? activeMember.id : null,
        paymentMethod: paymentMethod,
        items: cart.map(i => ({ name: i.name, price: i.price, qty: i.qty }))
      };

      const id = await db.transactions.add(newTransaction);
      const savedTransaction = { ...newTransaction, id };
      
      // Update stok secara sekuensial
      for (const item of cart) {
        await db.products.where('id').equals(item.id).modify(p => { p.stock -= item.qty; });
      }
      
      // Kirim data ke Customer Display DULU sebelum hapus cart
      setLastTransaction(savedTransaction);
      setShowReceipt(true);

      // Beri jeda sedikit agar BroadcastChannel sempat mengirim data terakhir
      setTimeout(() => {
        setCart([]);
        setCustomerName('');
        setMemberPhone('');
        setActiveMember(null);
        setShowQRISModal(false);
        setActiveTransactionId(null);
        setIsProcessing(false);
        
        fetchProducts(); 
        fetchTransactions();
        setCheckoutKey(k => k + 1);
      }, 500);
      
    } catch (e) { 
      console.error(e);
      alert('Gagal memproses transaksi.'); 
      setIsProcessing(false);
    }
  }, [cart, customerName, activeMember, paymentMethod, showQRISModal, total, settings, fetchProducts, fetchTransactions, isProcessing]);

  // Sync with Customer Display
    useEffect(() => {
      // Calculators
      const subtotal_val = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
      const taxAmount_val = subtotal_val * (parseInt(settings.taxRate) / 100);
      const discount_val = activeMember ? subtotal_val * (parseInt(settings.memberDiscount) / 100) : 0;
      const total_val = subtotal_val + taxAmount_val - discount_val;
  
      const channel = new BroadcastChannel('customer_display');
      channel.postMessage({ 
        cart, 
        subtotal: subtotal_val, 
        taxAmount: taxAmount_val, 
        discount: discount_val, 
        total: total_val, 
        storeName: settings.storeName,
        welcomeText: settings.welcomeText || 'Selamat Datang / Welcome',          
        customerName: customerName || '',
        isDark,
        themeColor: settings.themeColor,
        isCustomerDisplayOn: settings.isCustomerDisplayOn !== false,
        customerViewMode: customerViewMode,
        products: products,
        showReceipt: showReceipt,
        showQRIS: showQRISModal,
        qrisData: settings.qrisImage,
        isLoadingQR: false,
        lastTransaction: lastTransaction,
        storeAddress: settings.storeAddress
      });
      return () => channel.close();
    }, [cart, activeMember, settings, customerName, isDark, customerViewMode, products, showReceipt, lastTransaction, showQRISModal]);

  useEffect(() => {
    const findMember = async () => {
      if (memberPhone.length >= 10) {
        const found = await db.members.where('phone').equals(memberPhone).first();
        setActiveMember(found || null);
      } else {
        setActiveMember(null);
      }
    };
    findMember();
  }, [memberPhone]);

  useEffect(() => {
    const init = async () => {
      await seedDatabase();
      fetchProducts();
      fetchSettings();
      fetchTransactions();
      fetchMembers();
    };
    init();
  }, []);



  const exportToExcel = () => {
    if (transactions.length === 0) {
      alert('Tidak ada data transaksi untuk diekspor.');
      return;
    }

    const dataArr = transactions.map(t => ({
      'Tanggal & Waktu': new Date(t.timestamp).toLocaleString(),
      'ID Pesanan': `#POS-${t.id}`,
      'Nama Pelanggan': t.customerName,
      'Status Member': t.memberId ? 'Ya' : 'Tidak',
      'Total Bayar': t.total
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataArr);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");
    
    // Auto-size columns
    const max_width = dataArr.reduce((w, r) => Math.max(w, r['Nama Pelanggan'].length), 15);
    worksheet["!cols"] = [ { wch: 25 }, { wch: 15 }, { wch: max_width + 5 }, { wch: 15 }, { wch: 15 } ];

    XLSX.writeFile(workbook, `Laporan_Penjualan_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="pos-premium-layout">
      {/* Sidebar - Apple Style */}
      <aside className="premium-sidebar">
        <button className={`nav-link ${activeTab === 'pos' ? 'active' : ''}`} onClick={() => setActiveTab('pos')} title="Kasir">
          <IconStore />
        </button>
        <button className={`nav-link ${activeTab === 'stock' ? 'active' : ''}`} onClick={() => setActiveTab('stock')} title="Stok">
          <IconBox />
        </button>
        <button className={`nav-link ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')} title="Member">
          <IconUsers />
        </button>
        <button className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')} title="Histori">
          <IconHistory />
        </button>
        <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center'}}>
          <button 
            className={`nav-link ${customerViewMode === 'menu' ? 'active' : ''}`} 
            onClick={() => setCustomerViewMode(prev => prev === 'cart' ? 'menu' : 'cart')} 
            title={customerViewMode === 'cart' ? 'Tampilkan Menu di Layar Pelanggan' : 'Tampilkan Keranjang di Layar Pelanggan'}
            style={{background: customerViewMode === 'menu' ? 'var(--primary)' : 'var(--primary-soft)', color: customerViewMode === 'menu' ? 'white' : 'var(--primary)'}}
          >
            <IconMenu />
          </button>
          <button className="nav-link" onClick={() => setIsDark(!isDark)} style={{background: 'var(--primary-soft)', color: 'var(--primary)'}}>
            {isDark ? <IconSun /> : <IconMoon />}
          </button>
          <button className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} title="Pengaturan">
            <IconSettings />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="main-content">
        {activeTab === 'pos' && (
          <>
            <header className="header-minimal">
              <div>
                <h1>{settings.storeName}</h1>
                <p style={{color: 'var(--text-muted)'}}>{settings.storeAddress}</p>
              </div>
              <input 
                type="text" 
                placeholder="Cari produk di sini..." 
                className="search-premium"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </header>

              <div style={{display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem'}} className="hide-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '0.8rem 1.5rem',
                      borderRadius: '12px',
                      whiteSpace: 'nowrap',
                      fontWeight: 700,
                      background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-card)',
                      color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                      border: '1px solid var(--border)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="product-showcase">
                {products
                  .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
                  .filter(p => selectedCategory === 'Semua' || p.category === selectedCategory)
                  .map(p => (
                    <div key={p.id} className="p-card-premium" onClick={() => addToCart(p)}>
                      <div className="p-avatar" style={{background: p.stock < 10 ? '#ef4444' : 'var(--primary-soft)', color: p.stock < 10 ? 'white' : 'var(--primary)'}}>
                        {p.stock < 10 ? <IconAlert /> : p.name.charAt(0)}
                      </div>
                      <div className="p-info">
                        <span className="p-title">{p.name}</span>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem'}}>
                          <IconTag />
                          <span style={{fontSize: '0.8rem', opacity: 0.6}}>{p.category || 'Tanpa Kategori'}</span>
                        </div>
                        <span className="p-val">Rp {p.price.toLocaleString()}</span>
                        <span style={{fontSize: '0.8rem', color: p.stock < 10 ? '#ef4444' : 'var(--text-muted)', fontWeight: p.stock < 10 ? 700 : 400}}>
                          Stok: {p.stock} {p.stock < 10 ? '(Menipis!)' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <div style={{background: 'var(--bg-card)', padding: '3rem', borderRadius: '32px', flex: 1, boxShadow: 'var(--shadow-premium)', overflowY: 'auto'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <h2 style={{fontSize: '2rem'}}>Histori Penjualan</h2>
                <button 
                  onClick={exportToExcel}
                  style={{background: 'var(--primary-soft)', color: 'var(--primary)', padding: '0.8rem 1.5rem', fontWeight: 700, borderRadius: '12px'}}
                >
                  📥 Ekspor ke Excel (.xlsx)
                </button>
              </div>
              <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px'}}>
                <thead>
                  <tr style={{textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase'}}>
                    <th style={{padding: '0 1.5rem'}}>Waktu & Metode</th>
                    <th>ID Pesanan</th>
                    <th>Pelanggan</th>
                    <th>Total Bayar</th>
                    <th style={{textAlign: 'right', paddingRight: '1.5rem'}}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} style={{background: 'var(--bg-app)'}}>
                      <td style={{padding: '1.5rem', borderRadius: '16px 0 0 16px'}}>
                        <div style={{fontWeight: 600}}>{new Date(t.timestamp).toLocaleString()}</div>
                        <div style={{fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700}}>{t.paymentMethod || 'Cash'}</div>
                      </td>
                    <td style={{fontFamily: 'monospace'}}>#POS-{t.id}</td>
                    <td style={{fontWeight: 600}}>{t.customerName} {t.memberId ? '(Member)' : ''}</td>
                    <td style={{fontWeight: 700, color: 'var(--primary)'}}>Rp {t.total.toLocaleString()}</td>
                    <td style={{textAlign: 'right', borderRadius: '0 16px 16px 0', paddingRight: '1.5rem'}}>
                      <button 
                        style={{color: '#ef4444', background: '#fef2f2', padding: '0.5rem 1rem'}}
                        onClick={async () => {
                          if (confirm('Hapus transaksi ini?')) {
                            await db.transactions.delete(t.id);
                            fetchTransactions();
                          }
                        }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '4rem', color: 'var(--text-muted)'}}>Belum ada data transaksi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'stock' && (
          <div style={{background: 'var(--bg-card)', padding: '3rem', borderRadius: '32px', flex: 1, boxShadow: 'var(--shadow-premium)', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h2 style={{fontSize: '2rem'}}>Manajemen Stok Barang</h2>
              {products.some(p => p.stock < 10) && (
                <div style={{background: '#fef2f2', color: '#ef4444', padding: '1rem 2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #fee2e2'}}>
                  <IconAlert />
                  <span style={{fontWeight: 700}}>Peringatan: {products.filter(p => p.stock < 10).length} Produk Hampir Habis!</span>
                </div>
              )}
            </div>
            <form style={{display: 'flex', gap: '1.25rem', marginBottom: '4rem'}} onSubmit={async (e) => {
              e.preventDefault();
              await db.products.add({ ...formData, price: parseInt(formData.price), stock: parseInt(formData.stock) });
              setFormData({ name: '', price: '', stock: '', category: '' }); fetchProducts();
              alert('Produk berhasil ditambahkan!');
              window.location.reload();
            }}>
              <input 
                style={{flex: 2, padding: '1.2rem', fontSize: '1.1rem', fontWeight: 600}} 
                placeholder="Nama Produk" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required
              />
              <input 
                style={{flex: 1, padding: '1.2rem', fontSize: '1.1rem'}} 
                placeholder="Kategori" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                required
              />
              <input 
                style={{flex: 1, padding: '1.2rem', fontSize: '1.1rem'}} 
                type="number" 
                placeholder="Harga" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                required
              />
              <input 
                style={{width: '120px', padding: '1.2rem', fontSize: '1.1rem'}} 
                type="number" 
                placeholder="Stok" 
                value={formData.stock} 
                onChange={e => setFormData({...formData, stock: e.target.value})} 
                required
              />
              <button 
                type="submit" 
                style={{background: 'var(--primary)', color: 'white', padding: '0 2rem', fontWeight: 700}}
              >
                TAMBAH
              </button>
            </form>
            
            <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px'}}>
              <thead>
                <tr style={{textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase'}}>
                  <th style={{padding: '0 1.5rem'}}>Produk & Kategori</th>
                  <th>Nilai Jual</th>
                  <th>Stok Tersedia</th>
                  <th style={{textAlign: 'right', paddingRight: '1.5rem'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{background: 'var(--bg-app)'}}>
                    <td style={{padding: '1.5rem', borderRadius: '16px 0 0 16px'}}>
                      <div style={{fontWeight: 700}}>{p.name}</div>
                      <div style={{fontSize: '0.8rem', opacity: 0.6}}>{p.category || 'Tanpa Kategori'}</div>
                    </td>
                    <td style={{fontWeight: 700}}>Rp {p.price.toLocaleString()}</td>
                    <td style={{color: p.stock < 10 ? '#ef4444' : 'inherit'}}>{p.stock}</td>
                    <td style={{textAlign: 'right', borderRadius: '0 16px 16px 0', paddingRight: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center', height: '80px'}}>
                      <button 
                        style={{background: 'var(--primary-soft)', color: 'var(--primary)', padding: '0.5rem 1rem'}} 
                        onClick={() => setEditingProduct(p)}
                      >
                        Edit
                      </button>
                      <button style={{color: '#ef4444', background: '#fef2f2', padding: '0.5rem 1rem'}} onClick={async () => { if(confirm('Hapus produk ini?')) { await db.products.delete(p.id); fetchProducts(); } }}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'members' && (
          <div style={{background: 'var(--bg-card)', padding: '3rem', borderRadius: '32px', flex: 1, boxShadow: 'var(--shadow-premium)', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h2 style={{fontSize: '2rem'}}>Manajemen Member</h2>
              <input 
                type="text" 
                placeholder="Cari nama atau nomor HP member..." 
                className="search-premium"
                style={{width: '350px'}}
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
              />
            </div>
            
            <form style={{display: 'flex', gap: '1.25rem', marginBottom: '4rem'}} onSubmit={async (e) => {
              e.preventDefault();
              await db.members.add({ ...memberFormData });
              setMemberFormData({ name: '', phone: '' }); fetchMembers();
              alert('Member baru berhasil didaftarkan!');
            }}>
              <input 
                style={{flex: 1, padding: '1.2rem', fontSize: '1.1rem', fontWeight: 600}} 
                placeholder="Nama Lengkap Member" 
                value={memberFormData.name} 
                onChange={e => setMemberFormData({...memberFormData, name: e.target.value})} 
                required
              />
              <input 
                style={{flex: 1, padding: '1.2rem', fontSize: '1.1rem'}} 
                placeholder="Nomor Telepon / WhatsApp" 
                value={memberFormData.phone} 
                onChange={e => setMemberFormData({...memberFormData, phone: e.target.value})} 
                required
              />
              <button 
                type="submit" 
                style={{background: 'var(--primary)', color: 'white', padding: '0 2.5rem', fontWeight: 700}}
              >
                DAFTAR MEMBER
              </button>
            </form>

            <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px'}}>
              <thead>
                <tr style={{textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase'}}>
                  <th style={{padding: '0 1.5rem'}}>Nama Member</th>
                  <th>Nomor HP</th>
                  <th style={{textAlign: 'right', paddingRight: '1.5rem'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {members.filter(m => 
                  m.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
                  m.phone.includes(memberSearch)
                ).map(m => (
                  <tr key={m.id} style={{background: 'var(--bg-app)'}}>
                    <td style={{padding: '1.5rem', borderRadius: '16px 0 0 16px', fontWeight: 600}}>{m.name}</td>
                    <td style={{fontWeight: 700}}>{m.phone}</td>
                    <td style={{textAlign: 'right', borderRadius: '0 16px 16px 0', paddingRight: '1.5rem'}}>
                      <button style={{color: '#ef4444', background: '#fef2f2', padding: '0.5rem 1rem'}} onClick={async () => { if(confirm('Hapus member ini?')) { await db.members.delete(m.id); fetchMembers(); } }}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{background: 'var(--bg-card)', padding: '4rem', borderRadius: '32px', flex: 1, boxShadow: 'var(--shadow-premium)', overflowY: 'auto'}}>
            <h2 style={{fontSize: '2.5rem', marginBottom: '3rem', fontWeight: 800}}>Pengaturan Umum</h2>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                <h3 style={{fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)'}}>Informasi Toko</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  <label style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)'}}>NAMA TOKO</label>
                  <input 
                    style={{padding: '1.2rem', fontSize: '1.1rem', fontWeight: 600}}
                    value={settings.storeName} 
                    onChange={e => updateSetting('storeName', e.target.value)} 
                  />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  <label style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)'}}>ALAMAT LENGKAP</label>
                  <input 
                    style={{padding: '1.2rem', fontSize: '1.1rem'}}
                    value={settings.storeAddress} 
                    onChange={e => updateSetting('storeAddress', e.target.value)} 
                  />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  <label style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)'}}>TEKS UCAPAN (WELCOME)</label>
                  <input 
                    style={{padding: '1.2rem', fontSize: '1.1rem', fontWeight: 600}}
                    value={settings.welcomeText || 'Selamat Datang / Welcome'} 
                    onChange={e => updateSetting('welcomeText', e.target.value)} 
                  />
                </div>
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                <h3 style={{fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)'}}>Keuangan & Pajak</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  <label style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)'}}>PERSENTASE PAJAK (%)</label>
                  <input 
                    type="number" 
                    style={{padding: '1.2rem', fontSize: '1.1rem', fontWeight: 600}}
                    value={settings.taxRate} 
                    onChange={e => updateSetting('taxRate', e.target.value)} 
                  />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  <label style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)'}}>DISKON MEMBER (%)</label>
                  <input 
                    type="number" 
                    style={{padding: '1.2rem', fontSize: '1.1rem', fontWeight: 600}}
                    value={settings.memberDiscount} 
                    onChange={e => updateSetting('memberDiscount', e.target.value)} 
                  />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  <label style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)'}}>URL GAMBAR QRIS (MANUAL)</label>
                  <input 
                    type="text" 
                    placeholder="https://link-gambar-qris-anda.com/qris.jpg"
                    style={{padding: '1.2rem', fontSize: '1.1rem'}}
                    value={settings.qrisImage || ''} 
                    onChange={e => updateSetting('qrisImage', e.target.value)} 
                  />
                  <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Upload gambar QRIS Anda ke hosting gambar (seperti Imgur atau PostImages) lalu tempel link-nya di sini.</p>
                </div>
              </div>
            </div>

            <div style={{marginTop: '4rem', padding: '2rem', background: 'var(--bg-app)', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <h3 style={{fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary)'}}>Layar Pelanggan (Customer View)</h3>
                <p style={{color: 'var(--text-muted)'}}>Aktifkan atau matikan tampilan layar untuk pelanggan.</p>
              </div>
              <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                <button 
                  onClick={() => window.open(window.location.origin + window.location.pathname + '#customer-view', '_blank', 'width=1200,height=800')}
                  style={{background: 'var(--primary-soft)', color: 'var(--primary)', padding: '0.8rem 1.5rem', fontWeight: 700, borderRadius: '12px'}}
                >
                  Buka Layar Pelanggan ↗
                </button>
                <button 
                  onClick={() => updateSetting('isCustomerDisplayOn', settings.isCustomerDisplayOn === false ? true : false)}
                  style={{
                    background: settings.isCustomerDisplayOn === false ? '#ef4444' : '#22c55e', 
                    color: 'white', 
                    padding: '0.8rem 2rem', 
                    fontWeight: 800, 
                    borderRadius: '12px',
                    minWidth: '160px',
                    boxShadow: settings.isCustomerDisplayOn === false ? '0 10px 15px -3px #ef444455' : '0 10px 15px -3px #22c55e55'
                  }}
                >
                  {settings.isCustomerDisplayOn === false ? 'MATI (OFF)' : 'HIDUP (ON)'}
                </button>
              </div>
            </div>

            <div style={{marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)'}}>
              <h3 style={{fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)'}}>Personalisasi Tema</h3>
              <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem'}}>Atur warna tema dengan nilai RGB sesuai brand toko kamu:</p>
              
              {/* Visual Color Picker & Preview Box */}
              <div style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem', background: 'var(--bg-app)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)'}}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: '90px', height: '90px', borderRadius: '22px',
                    background: rgbToHex(rgb.r, rgb.g, rgb.b),
                    boxShadow: `0 12px 30px ${rgbToHex(rgb.r, rgb.g, rgb.b)}55`,
                    transition: 'background 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '4px solid white',
                  }}>
                    <input 
                      type="color" 
                      value={rgbToHex(rgb.r, rgb.g, rgb.b)}
                      onChange={e => {
                        isRgbUserChange.current = true;
                        setRgb(hexToRgb(e.target.value));
                      }}
                      style={{
                        position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer'
                      }}
                    />
                    <div style={{fontSize: '1.5rem', filter: 'invert(1) grayscale(1) contrast(9)'}}>🎨</div>
                  </div>
                  <div style={{
                    position: 'absolute', bottom: '-10px', right: '-10px', 
                    background: 'var(--primary)', color: 'white', padding: '4px 8px', 
                    borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800
                  }}>PICK</div>
                </div>

                <div style={{flex: 1}}>
                  <div style={{fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem'}}>Warna Aktif</div>
                  <div style={{display: 'flex', alignItems: 'baseline', gap: '1rem'}}>
                    <div style={{fontFamily: 'monospace', fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)'}}>
                      {rgbToHex(rgb.r, rgb.g, rgb.b).toUpperCase()}
                    </div>
                    <div style={{fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500}}>
                      rgb({rgb.r}, {rgb.g}, {rgb.b})
                    </div>
                  </div>
                  <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem'}}>Klik pada kotak warna untuk memilih menggunakan color picker visual.</p>
                </div>
              </div>

              {/* Input R G B */}
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
                {[
                  { channel: 'r', label: 'R — Red', color: '#ef4444' },
                  { channel: 'g', label: 'G — Green', color: '#22c55e' },
                  { channel: 'b', label: 'B — Blue', color: '#3b82f6' }
                ].map(({ channel, label, color }) => (
                  <div key={channel} style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1}}>
                    <label style={{fontSize: '0.8rem', fontWeight: 800, color: color, letterSpacing: '0.05em'}}>{label}</label>
                    <input
                      type="number"
                      min="0" max="255"
                      value={rgb[channel]}
                      onChange={e => { isRgbUserChange.current = true; setRgb(prev => ({ ...prev, [channel]: Math.min(255, Math.max(0, parseInt(e.target.value) || 0)) })); }}
                      style={{
                        padding: '1rem', textAlign: 'center',
                        fontFamily: 'monospace', fontWeight: 700, fontSize: '1.3rem',
                        border: `2px solid ${color}44`, borderRadius: '12px'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Quick presets */}
              <div style={{marginTop: '1.5rem'}}>
                <p style={{fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem'}}>PRESET CEPAT</p>
                <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                  {[
                    { name: 'Indigo', r: 99, g: 102, b: 241 },
                    { name: 'Emerald', r: 16, g: 185, b: 129 },
                    { name: 'Rose', r: 244, g: 63, b: 94 },
                    { name: 'Amber', r: 245, g: 158, b: 11 },
                    { name: 'Violet', r: 139, g: 92, b: 246 },
                    { name: 'Sky', r: 14, g: 165, b: 233 }
                  ].map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => { isRgbUserChange.current = true; setRgb({ r: preset.r, g: preset.g, b: preset.b }); }}
                      title={preset.name}
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: rgbToHex(preset.r, preset.g, preset.b),
                        border: (rgb.r === preset.r && rgb.g === preset.g && rgb.b === preset.b)
                          ? '3px solid var(--text-main)' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'transform 0.15s',
                        transform: (rgb.r === preset.r && rgb.g === preset.g && rgb.b === preset.b) ? 'scale(1.2)' : 'scale(1)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Checkout Sidebar Premium (Show only during POS) */}
      {activeTab === 'pos' && (
        <aside className="checkout-premium" key={checkoutKey}>
          <h2 style={{fontSize: '1.5rem', fontWeight: 700}}>Detail Pesanan</h2>
          
          <div className="order-list">
            {cart.length === 0 ? (
              <div style={{textAlign: 'center', marginTop: '5rem', opacity: 0.3}}>
                <IconStore />
                <p style={{marginTop: '1rem', fontWeight: 500}}>Belum ada pesanan</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="item-row">
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 600}}>{item.name}</div>
                    <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Rp {item.price.toLocaleString()}</div>
                  </div>
                  <div className="item-qty-pill">
                    <button className="btn-circle" onClick={() => updateQty(item.id, -1)}>-</button>
                    <span style={{fontWeight: 700, minWidth: '20px', textAlign: 'center'}}>{item.qty}</span>
                    <button className="btn-circle" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{marginBottom: '1rem'}}>
            <p style={{fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-muted)'}}>NAMA PELANGGAN / MEJA</p>
            <input 
              type="text" 
              placeholder="Nama Pelanggan Umum" 
              style={{width: '100%', padding: '0.8rem', fontSize: '1rem', borderRadius: '12px'}}
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
            />
          </div>

          <div style={{marginBottom: '1rem'}}>
            <p style={{fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-muted)'}}>NOMOR MEMBER (HP)</p>
            <div style={{position: 'relative'}}>
              <input 
                type="text" 
                placeholder="Cari No. HP Member..." 
                style={{width: '100%', padding: '0.8rem', fontSize: '1rem', border: activeMember ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: '12px'}}
                value={memberPhone}
                onChange={e => setMemberPhone(e.target.value)}
              />
              {activeMember && (
                <div style={{
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  background: 'var(--primary)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 10px var(--primary-soft)'
                }}>
                  ✓ {activeMember.name}
                </div>
              )}
            </div>
          </div>



          <div style={{marginBottom: '2rem'}}>
            <p style={{fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-muted)'}}>METODE PEMBAYARAN</p>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem'}}>
              {[
                { name: 'Cash', icon: <IconStore /> },
                { name: 'QRIS', icon: <IconQR /> },
                { name: 'Debit', icon: <IconCreditCard /> }
              ].map(m => (
                <button
                  key={m.name}
                  onClick={() => setPaymentMethod(m.name)}
                  style={{
                    padding: '1rem 0',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: paymentMethod === m.name ? 'var(--primary-soft)' : 'var(--bg-app)',
                    border: paymentMethod === m.name ? '2px solid var(--primary)' : '1px solid var(--border)',
                    color: paymentMethod === m.name ? 'var(--primary)' : 'var(--text-main)',
                    transition: 'all 0.2s'
                  }}
                >
                  {m.icon}
                  <span style={{fontSize: '0.75rem', fontWeight: 700}}>{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bill-summary">
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem'}}>
              <span>Subtotal</span>
              <span style={{fontWeight: 600}}>Rp {subtotal.toLocaleString()}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem'}}>
              <span>Pajak ({settings.taxRate}%)</span>
              <span style={{fontWeight: 600}}>Rp {taxAmount.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div style={{display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontSize: '0.9rem'}}>
                <span>Diskon Member ({settings.memberDiscount}%)</span>
                <span>-Rp {discount.toLocaleString()}</span>
              </div>
            )}
            <div style={{marginTop: '1rem', marginBottom: '1.5rem'}}>
              <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>Grand Total</span>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                 <span className="grand-total" style={{fontSize: '2.5rem'}}>Rp {total.toLocaleString()}</span>
              </div>
            </div>
            <button className="btn-checkout-premium" onClick={handleCheckout} style={{
              height: '80px', 
              fontSize: '1.2rem',
              background: showQRISModal ? '#22c55e' : 'var(--primary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.2rem'
            }}>
              {showQRISModal ? (
                <>
                  <span style={{fontSize: '1.4rem'}}>KONFIRMASI SUDAH BAYAR</span>
                  <span style={{fontSize: '0.8rem', opacity: 0.8}}>(Klik jika pelanggan sudah scan & bayar)</span>
                </>
              ) : (
                `BAYAR SEKARANG (${paymentMethod})`
              )}
            </button>
            {showQRISModal && (
              <button 
                onClick={() => setShowQRISModal(false)}
                style={{
                  marginTop: '1rem',
                  width: '100%',
                  padding: '1rem',
                  background: 'transparent',
                  color: '#ef4444',
                  fontWeight: 700,
                  border: '1px solid #ef444433',
                  borderRadius: '16px'
                }}
              >
                BATALKAN QRIS
              </button>
            )}
          </div>
        </aside>
      )}

      {/* Modal Cetak Struk */}
      {showReceipt && lastTransaction && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'}}>
          <div style={{background: 'white', color: 'black', width: '400px', padding: '3rem', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', textAlign: 'center'}}>
            <div style={{fontFamily: 'monospace'}}>
              <h2 style={{fontSize: '1.5rem', fontWeight: 800}}>{settings.storeName}</h2>
              <p style={{fontSize: '0.8rem', marginBottom: '2rem'}}>{settings.storeAddress}</p>
              
              <div style={{textAlign: 'left', borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc', padding: '1.5rem 0', margin: '1.5rem 0'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem'}}>
                  <span>ID Transaksi:</span>
                  <span>#POS-{lastTransaction.id}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem'}}>
                  <span>Nama Customer:</span>
                  <span>{lastTransaction.customerName}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.8rem'}}>
                  <span>Waktu:</span>
                  <span>{new Date(lastTransaction.timestamp).toLocaleString()}</span>
                </div>
                
                {lastTransaction.items?.map((item, idx) => (
                  <div key={idx} style={{marginBottom: '0.5rem'}}>
                    <div style={{fontWeight: 700}}>{item.name}</div>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                      <span>{item.qty} x {item.price.toLocaleString()}</span>
                      <span>{(item.qty * item.price).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{textAlign: 'right', gap: '0.5rem', display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>Total:</span>
                  <span style={{fontWeight: 800, fontSize: '1.2rem'}}>Rp {lastTransaction.total.toLocaleString()}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}>
                  <span>Metode:</span>
                  <span>{lastTransaction.paymentMethod}</span>
                </div>
              </div>

              <div style={{marginTop: '3rem', fontSize: '0.8rem'}}>
                --- Terima Kasih ---
              </div>
            </div>

            <div style={{display: 'flex', gap: '1rem', marginTop: '3rem'}}>
              <button 
                onClick={() => window.print()} 
                style={{flex: 2, padding: '1.2rem', background: '#000', color: '#fff', borderRadius: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}
              >
                <IconPrinter /> CETAK STRUK
              </button>
              <button 
                onClick={() => { setShowReceipt(false); window.location.reload(); }}
                style={{flex: 1, padding: '1.2rem', background: '#f3f4f6', color: '#000', borderRadius: '16px', fontWeight: 700}}
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal Premium */}
      {editingProduct && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background: 'var(--bg-card)', width: '500px', padding: '3rem', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'}}>
            <h2 style={{fontSize: '2rem', marginBottom: '2rem'}}>Edit Produk</h2>
            <form onSubmit={handleUpdateProduct} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <label style={{fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)'}}>NAMA PRODUK</label>
                <input 
                  style={{padding: '1.2rem'}}
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  required
                />
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <label style={{fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)'}}>KATEGORI</label>
                <input 
                  style={{padding: '1.2rem'}}
                  value={editingProduct.category || ''}
                  onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                />
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <label style={{fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)'}}>HARGA JUAL</label>
                <input 
                  type="number"
                  style={{padding: '1.2rem'}}
                  value={editingProduct.price}
                  onChange={e => setEditingProduct({...editingProduct, price: e.target.value})}
                  required
                />
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <label style={{fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)'}}>STOK TERSEDIA</label>
                <input 
                  type="number"
                  style={{padding: '1.2rem'}}
                  value={editingProduct.stock}
                  onChange={e => setEditingProduct({...editingProduct, stock: e.target.value})}
                  required
                />
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                <button 
                  type="button" 
                  onClick={() => setEditingProduct(null)}
                  style={{flex: 1, padding: '1.2rem', background: 'var(--primary-soft)', color: 'var(--primary)', fontWeight: 700}}
                >
                  BATAL
                </button>
                <button 
                  type="submit" 
                  style={{flex: 2, padding: '1.2rem', background: 'var(--primary)', color: 'white', fontWeight: 700}}
                >
                  SIMPAN PERUBAHAN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Main() {
  const [view, setView] = useState(window.location.hash);

  useEffect(() => {
    const handleHash = () => setView(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    // Jalankan pengecekan manual saat pertama kali mount
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Jika URL mengandung kata customer-view, tampilkan layar pelanggan
  if (view.includes('customer-view')) {
    return <CustomerBoard />;
  }
  
  return <App />;
}

export default Main;