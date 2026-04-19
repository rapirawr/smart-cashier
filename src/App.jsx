import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Pause, X, Check, AlertTriangle, Download } from 'lucide-react'
import pkg from '../package.json'
import { db } from './db'
import { supabase } from './supabaseClient'
import * as XLSX from 'xlsx'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'
import CashCalculator from './components/CashCalculator'
import KitchenDisplay from './components/KitchenDisplay'
import './App.css'

//  Icon Components
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
const IconEye = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconTrash = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const IconUpload = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
const IconDashboard = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>;
const IconPause = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
const IconCart = ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;

const CustomerBoard = () => {
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
              <span>{data.lastTransaction.customer_name}</span>
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
      <div className="pos-layout" style={{height: '100vh', padding: '4rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)'}}>
        <header style={{marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)'}}>{data.store_name}</h1>
            <p style={{fontSize: '1.5rem', color: 'var(--text-muted)'}}>Daftar Menu Kami / Our Menu</p>
          </div>
          <div style={{background: 'var(--primary)', padding: '1rem 2rem', borderRadius: '16px', color: 'white'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 700}}>Menu {data.store_name}</h2>
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
                  gap: '2rem',
                  padding: '10rem 0'
                }}>
                  <div style={{transform: 'scale(5)'}}>
                    <IconBox />
                  </div>
                  <h2 style={{fontSize: '2.5rem', fontWeight: 800}}>Belum Ada Menu Tersedia</h2>
                </div>
              );
            }

            return filtered.map(p => (
              <div key={p.id} style={{background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
                <div style={{width: '80px', height: '80px', background: 'var(--primary-soft)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--primary)', fontWeight: 800}}>
                  {p.name.charAt(0)}
                </div>
                <div>
                  <div style={{fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)'}}>{p.name}</div>
                  <div style={{fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>
                    {p.category}
                    {p.variants && <span style={{marginLeft: '0.8rem', color: 'var(--primary)', fontWeight: 700, background: 'var(--primary-soft)', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.9rem'}}>• {p.variants}</span>}
                  </div>
                  <div style={{fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)'}}>Rp {p.price.toLocaleString()}</div>
                </div>
              </div>
            ));
          })()}
        </div>

      </div>
    );
  }

  return (
    <div className="pos-layout" style={{height: '100vh', padding: '4rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)'}}>
      <header style={{marginBottom: '3rem', borderBottom: '2px solid var(--border)', paddingBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <h1 style={{fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)'}}>{data.store_name}</h1>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem'}}>
            <p style={{fontSize: '1.5rem', color: 'var(--text-muted)'}}>{data.welcome_text}</p>
            {data.cashierName && (
              <span style={{
                background: 'var(--primary-soft)', color: 'var(--primary)', 
                padding: '0.4rem 1rem', borderRadius: '12px', 
                fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase'
              }}>
                Kasir: {data.cashierName}
              </span>
            )}
          </div>
        </div>
        <div style={{
          textAlign: 'right', background: 'var(--primary)', padding: '1.5rem 2.5rem', 
          borderRadius: '24px', color: 'white', 
          boxShadow: `0 20px 40px -10px ${data.themeColor}66`,
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <p style={{fontSize: '0.9rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem'}}>Pelanggan</p>
          <h2 style={{fontSize: '2.5rem', fontWeight: 800}}>{data.customerName || 'UMUM'}</h2>
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
          data.cart.map((item, idx) => (
            <div key={`${item.id}-${idx}`} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)'}}>
              <div>
                <div style={{fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)'}}>
                  {item.name}
                  {item.selectedVariant && <span style={{fontSize: '1.5rem', color: 'var(--primary)', marginLeft: '1rem'}}>({item.selectedVariant})</span>}
                </div>
                <div style={{fontSize: '1.5rem', color: 'var(--text-muted)'}}>{item.qty} x Rp {item.price.toLocaleString()}</div>
              </div>
              <div style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)'}}>
                Rp {(item.price * item.qty).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      <footer style={{marginTop: '3rem', background: 'var(--bg-card)', padding: '3rem', borderRadius: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', boxShadow: 'var(--shadow-main)'}}>
        <span style={{fontSize: '2rem', fontWeight: 600, color: 'var(--text-main)'}}>Total Bayar</span>
        <span style={{fontSize: '5rem', fontWeight: 900, color: 'var(--primary)'}}>Rp {(data.total || 0).toLocaleString()}</span>
      </footer>
    </div>
  );
};

function App() {
  const [settings, setSettings] = useState({
    storeName: 'Luma POS',
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
  const [updateInfo, setUpdateInfo] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('available'); // available, downloading, ready
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [toast, setToast] = useState(null);
  const [heldOrders, setHeldOrders] = useState([]);
  const [showCashCalc, setShowCashCalc] = useState(false);
  const [transactionNotes, setTransactionNotes] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: '', variants: '', image: '' });
  const [historySearch, setHistorySearch] = useState('');
  const [historyDateFilter, setHistoryDateFilter] = useState('all');
  const [activeCashier, setActiveCashier] = useState(localStorage.getItem('activeCashier') || '');
  const [activeCaptain, setActiveCaptain] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('activeCashier'));
  const [dialog, setDialog] = useState(null); // { title, message, onConfirm, onCancel, type: 'alert' | 'confirm' }

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    // Only attempt to use electron if we're in the electron environment
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      
      ipcRenderer.on('update_available', () => {
        setIsCheckingUpdate(false);
        setUpdateInfo({ version: pkg.version });
        setUpdateStatus('available');
      });

      ipcRenderer.on('update_not_available', () => {
        setIsCheckingUpdate(false);
        setUpdateMessage('Aplikasi sudah versi terbaru.');
        setTimeout(() => setUpdateMessage(''), 3000);
      });

      ipcRenderer.on('update_downloaded', () => {
        setUpdateStatus('ready');
      });

      ipcRenderer.on('update_error', () => {
        setIsCheckingUpdate(false);
      });

      return () => {
        ipcRenderer.removeAllListeners('update_available');
        ipcRenderer.removeAllListeners('update_not_available');
        ipcRenderer.removeAllListeners('update_downloaded');
        ipcRenderer.removeAllListeners('update_error');
      };
    }
  }, []);

  const startUpdateDownload = () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('start_download');
      setUpdateStatus('downloading');
    }
  };

  const restartAndInstall = () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('restart_app');
    }
  };

  const fetchSettings = useCallback(async () => {
    try {
      const { data: s, error } = await supabase.from('settings').select('*').single();
      if (error) throw error;
      
      if (s) {
        setSettings(s);
        if (s.is_dark !== undefined) setIsDark(s.is_dark);
        // Apply theme color
        if (s.primary_color) {
          document.documentElement.style.setProperty('--primary', s.primary_color);
          document.documentElement.style.setProperty('--primary-soft', s.primary_color + '26');
        }
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  }, []);

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Update local theme immediately if color or theme changed
    if (key === 'primary_color') {
      document.documentElement.style.setProperty('--primary', value);
      document.documentElement.style.setProperty('--primary-soft', value + '26');
    }
    
    // Save to Supabase
    let settingsId = settings?.id;
    if (!settingsId) {
       const { data } = await supabase.from('settings').select('id').single();
       settingsId = data?.id;
    }

    if (settingsId) {
      const { error } = await supabase.from('settings').update({ [key]: value }).eq('id', settingsId);
      if (error) console.error("Failed to update setting:", error);
    }
    
    // Notify other views (Kitchen, Customer)
    const bc = new BroadcastChannel('customer_display');
    bc.postMessage({ [key]: value });
    bc.close();
  };

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase.from('products').select('*').order('name');
    if (!error) setProducts(data);
  }, []);

  const fetchMembers = useCallback(async () => {
    const { data, error } = await supabase.from('members').select('*').order('name');
    if (!error) setMembers(data);
  }, []);

  const fetchTransactions = useCallback(async () => {
    const { data, error } = await supabase.from('transactions').select('*').order('timestamp', { ascending: false });
    if (!error) setTransactions(data);
  }, []);

  const customConfirm = (title, message, onConfirm) => {
    setDialog({ title, message, onConfirm, type: 'confirm' });
  };

  const customAlert = (title, message) => {
    setDialog({ title, message, type: 'alert' });
  };
  
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
    updateSetting('primary_color', hex);
  }, [rgb, updateSetting]);

  // 3. Sinkronisasi dari Settings (saat load pertama)
  useEffect(() => {
    if (settings.primary_color) {
      const newRgb = hexToRgb(settings.primary_color);
      setRgb(prev => {
        if (prev.r === newRgb.r && prev.g === newRgb.g && prev.b === newRgb.b) return prev;
        return newRgb;
      });
    }
  }, [settings.primary_color]);

  // 4. Sinkronisasi Dark Mode
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    // Only update if it actually changed in settings
    if (settings.is_dark !== isDark) {
      updateSetting('is_dark', isDark);
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('activeCashier', activeCashier);
  }, [activeCashier]);

  const [memberFormData, setMemberFormData] = useState({ name: '', phone: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToSelectVariant, setProductToSelectVariant] = useState(null);

  const categories = ['Semua', ...new Set(products.flatMap(p => (p.category || 'Lainnya').split(',').map(c => c.trim())))];


  const addToCart = useCallback((product, variant = null) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedVariant === variant);
      if (existing) return prev.map(item => (item.id === product.id && item.selectedVariant === variant) ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1, selectedVariant: variant }];
    });
    setProductToSelectVariant(null);
  }, []);

  const updateQty = useCallback((id, variant, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedVariant === variant) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(i => i.qty > 0));
  }, []);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const { error } = await supabase.from('products').update({
      name: editingProduct.name,
      price: parseInt(editingProduct.price),
      stock: parseInt(editingProduct.stock),
      category: editingProduct.category,
      variants: editingProduct.variants
    }).eq('id', editingProduct.id);
    
    if (!error) {
      setEditingProduct(null);
      fetchProducts();
      showToast('Produk berhasil diperbarui!');
    }
  };

  // === ADD PRODUCT ===
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) return;
    const { error } = await supabase.from('products').insert({
      name: formData.name, price: parseInt(formData.price), stock: parseInt(formData.stock),
      category: formData.category || 'Umum', variants: formData.variants || '', image: formData.image || ''
    });
    if (!error) {
      setFormData({ name: '', price: '', stock: '', category: '', variants: '', image: '' });
      setShowAddProduct(false);
      fetchProducts();
      showToast('Produk baru berhasil ditambahkan!');
    }
  };

  // === HOLD / RESUME ORDER ===
  const holdCurrentOrder = useCallback(() => {
    if (cart.length === 0) return;
    setHeldOrders(prev => [...prev, { id: Date.now(), timestamp: new Date().toISOString(), customerName: customerName || 'Umum', items: [...cart], total: cart.reduce((a,i) => a + i.price*i.qty, 0), notes: transactionNotes }]);
    setCart([]); setCustomerName(''); setTransactionNotes(''); setMemberPhone(''); setActiveMember(null);
    setCheckoutKey(k => k + 1);
    showToast('Pesanan berhasil ditahan!');
  }, [cart, customerName, transactionNotes, showToast]);

  const resumeOrder = useCallback((heldId) => {
    const order = heldOrders.find(h => h.id === heldId);
    if (!order) return;
    setCart(order.items); setCustomerName(order.customerName); setTransactionNotes(order.notes || '');
    setHeldOrders(prev => prev.filter(h => h.id !== heldId));
    showToast('Pesanan dilanjutkan!');
  }, [heldOrders, showToast]);

  const removeHeldOrder = useCallback((heldId) => {
    setHeldOrders(prev => prev.filter(h => h.id !== heldId));
    showToast('Pesanan yang ditahan dihapus.');
  }, [showToast]);

  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const taxAmount = subtotal * (parseInt(settings.taxRate) / 100);
  const discount = activeMember ? subtotal * (parseInt(settings.memberDiscount) / 100) : 0;
  const total = subtotal + taxAmount - discount;

  const handleCheckout = useCallback(async () => {
    if (cart.length === 0 || isProcessing) return;
    setIsProcessing(true);
    
    // Cash: show calculator first
    if (paymentMethod === 'Cash' && !showCashCalc && !showQRISModal) {
      setShowCashCalc(true);
      setIsProcessing(false);
      return;
    }

    // QRIS: show QR modal first
    if (paymentMethod === 'QRIS' && !showQRISModal) {
      setShowQRISModal(true);
      setIsProcessing(false);
      return;
    }

    try {
      const transaction = {
        timestamp: new Date().toISOString(),
        total: total,
        subtotal: subtotal,
        tax: taxAmount,
        discount: discount,
        customer_name: customerName || 'Umum',
        member_phone: activeMember ? activeMember.phone : null,
        payment_method: paymentMethod,
        items: cart.map(item => ({ name: item.name, price: item.price, qty: item.qty, selectedVariant: item.selectedVariant })),
        notes: transactionNotes,
        status: 'preparing',
        cashier_name: activeCashier || 'Admin',
        captain_name: activeCaptain || 'Self'
      };

      const { data, error } = await supabase.from('transactions').insert(transaction).select();
      if (error) throw error;
      const savedTransaction = data[0];
      
      // Notify Kitchen (via Real-time, but BroadcastChannel still used for same-browser sync)
      const kitchenChannel = new BroadcastChannel('kitchen_display');
      kitchenChannel.postMessage({ type: 'NEW_ORDER', order: savedTransaction });
      kitchenChannel.close();

      // Update stok secara sekuensial di Supabase
      for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          await supabase.from('products').update({ stock: product.stock - item.qty }).eq('id', item.id);
        }
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
        setShowCashCalc(false);
        setTransactionNotes('');
        
        fetchProducts(); 
        fetchTransactions();
        setCheckoutKey(k => k + 1);
      }, 500);
      
    } catch (err) {
      console.error(err);
      customAlert('Error', 'Gagal memproses transaksi.');
      setIsProcessing(false);
    }
  }, [cart, customerName, activeMember, paymentMethod, transactionNotes, discount, activeCashier, activeCaptain, showToast, total, showCashCalc, showQRISModal, isProcessing]);

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
        themeColor: rgbToHex(rgb.r, rgb.g, rgb.b),
        isCustomerDisplayOn: settings.isCustomerDisplayOn !== false,
        customerViewMode: customerViewMode,
        products: products,
        showReceipt: showReceipt,
        showQRIS: showQRISModal,
        qrisData: settings.qrisImage,
        isLoadingQR: false,
        lastTransaction: lastTransaction,
        storeAddress: settings.storeAddress,
        cashierName: activeCashier
      });
      return () => channel.close();
    }, [cart, activeMember, settings, customerName, isDark, customerViewMode, products, showReceipt, lastTransaction, showQRISModal, rgb, activeCashier]);

  useEffect(() => {
    const findMember = async () => {
      if (memberPhone.length >= 10) {
        const { data, error } = await supabase.from('members').select('*').eq('phone', memberPhone).maybeSingle();
        if (!error) setActiveMember(data || null);
      } else {
        setActiveMember(null);
      }
    };
    findMember();
  }, [memberPhone]);

  useEffect(() => {
    const handleGlobalShortcuts = (e) => {
      // Focus Search: Ctrl + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-box')?.focus();
      }
      
      // Hold Order: Ctrl + H
      if ((e.ctrlKey || e.metaKey) && e.key === 'h' && activeTab === 'pos') {
        e.preventDefault();
        holdCurrentOrder();
      }

      // Print Receipt: Ctrl + P
      if ((e.ctrlKey || e.metaKey) && e.key === 'p' && showReceipt) {
        e.preventDefault();
        window.print();
      }

      // Tab Switching: Ctrl + 1-5
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
        const tabs = ['dashboard', 'pos', 'stock', 'members', 'history'];
        setActiveTab(tabs[parseInt(e.key) - 1]);
      }

      // Quick Checkout / Confirm: Enter
      if (e.key === 'Enter') {
        if (dialog) {
          if (dialog.onConfirm) dialog.onConfirm();
          setDialog(null);
          setTimeout(() => document.querySelector('.search-box')?.focus(), 100);
          return;
        }
        // Only trigger checkout if no modals are open and we are in POS tab
        if (activeTab === 'pos' && cart.length > 0 && !isProcessing && !showReceipt && !showCashCalc && !showQRISModal) {
          // If not in input/textarea (except search)
          if (document.activeElement.tagName !== 'INPUT' || document.activeElement.classList.contains('search-box')) {
            handleCheckout();
          }
        }
      }

      // Close Modals & Dialogs: Escape
      if (e.key === 'Escape') {
        if (dialog) {
          setDialog(null);
          return;
        }
        setShowCashCalc(false);
        setShowQRISModal(false);
        setEditingProduct(null);
        setProductToSelectVariant(null);
        if (showReceipt) setShowReceipt(false);
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [activeTab, cart.length, isProcessing, showReceipt, showCashCalc, total, holdCurrentOrder, handleCheckout]);

  useEffect(() => {
    const init = async () => {

      fetchProducts();
      fetchSettings();
      fetchTransactions();
      fetchMembers();
    };
    init();
  }, []);



  const sendToKitchen = async () => {
    if (cart.length === 0) return;
    try {
      const transaction = {
        timestamp: new Date().toISOString(),
        total: total,
        customerName: customerName || 'Umum',
        memberId: activeMember ? activeMember.id : null,
        payment_method: 'Dapur (Pending)',
        items: cart.map(item => ({ name: item.name, price: item.price, qty: item.qty, selectedVariant: item.selectedVariant })),
        notes: transactionNotes,
        discount: discount,
        status: 'preparing',
        cashier_name: activeCashier || 'Admin',
        captain_name: activeCaptain || 'Self'
      };
      const { data, error } = await supabase.from('transactions').insert(transaction).select();
      if (error) throw error;
      const id = data[0].id;
      
      const kitchenChannel = new BroadcastChannel('kitchen_display');
      kitchenChannel.postMessage({ type: 'NEW_ORDER', order: { ...transaction, id } });
      kitchenChannel.close();

      showToast('Pesanan dikirim ke Dapur!');
      setCart([]);
      setCustomerName('');
      setTransactionNotes('');
      setActiveCaptain('');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengirim ke dapur', 'error');
    }
  };

  const exportToExcel = () => {
    if (transactions.length === 0) {
      customAlert('Ekspor', 'Tidak ada data transaksi untuk diekspor.');
      return;
    }

    const dataArr = transactions.map(t => ({
      'Tanggal & Waktu': new Date(t.timestamp).toLocaleString(),
      'ID Pesanan': `#transaction-${t.id}`,
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

  const handleLogin = (name) => {
    setActiveCashier(name);
    setIsLoggedIn(true);
    
    // Windows are now opened automatically on app startup as per latest request.
    // If they were closed, they can be re-opened from the Settings menu.
  };

  const handleLogout = () => {
    customConfirm('Ganti Kasir', 'Apakah Anda yakin ingin mengganti kasir (Log Out)?', () => {
      setIsLoggedIn(false);
      setActiveCashier('');
      localStorage.removeItem('activeCashier');
    });
  };

  const handleExit = () => {
    customConfirm('Keluar', 'Apakah Anda yakin ingin keluar dari aplikasi?', () => {
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('quit-app');
      } else {
        window.close();
      }
    });
  };

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    updateSetting('is_dark', newMode);
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        height: '100vh', width: '100vw', background: 'var(--bg-app)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '2rem'
      }}>
        <div style={{
          background: 'var(--bg-card)', padding: '3rem', borderRadius: '32px',
          boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
          width: '400px', textAlign: 'center', animation: 'fadeIn 0.5s ease-out'
        }}>
          <div style={{
            width: '80px', height: '80px', background: 'var(--primary-soft)',
            color: 'var(--primary)', borderRadius: '24px', margin: '0 auto 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <IconStore />
          </div>
          <h1 style={{fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem'}}>Luma POS</h1>
          <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>Silakan masukkan nama kasir yang bertugas</p>
          
          <input 
            type="text" 
            placeholder="Nama Kasir" 
            autoFocus
            style={{
              width: '100%', padding: '1.2rem', fontSize: '1.1rem', 
              borderRadius: '16px', border: '2px solid var(--border)',
              background: 'var(--bg-app)', color: 'var(--text-main)',
              textAlign: 'center', fontWeight: 700, marginBottom: '1.5rem'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) handleLogin(e.target.value);
            }}
          />
          
          <button 
            onClick={() => {
              const input = document.querySelector('input[placeholder="Nama Kasir"]');
              if (input.value) handleLogin(input.value);
            }}
            className="btn btn-primary"
            style={{width: '100%', padding: '1.2rem', borderRadius: '16px', fontWeight: 800}}
          >
            MASUK KE SISTEM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pos-layout">
      {/* Sidebar -  Branding */}
      <aside className="app-sidebar">
        <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')} title="Dashboard">
          <IconDashboard />
        </button>
        <button className={`nav-link ${activeTab === 'pos' ? 'active' : ''}`} onClick={() => setActiveTab('pos')} title="Kasir" style={{position: 'relative'}}>
          <IconStore />
          {heldOrders.length > 0 && <div style={{position:'absolute',top:'-4px',right:'-4px',width:'18px',height:'18px',borderRadius:'50%',background:'var(--warning)',color:'white',fontSize:'0.65rem',fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center'}}>{heldOrders.length}</div>}
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
        <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', width: '100%'}}>
          <button 
            className={`nav-link ${customerViewMode === 'menu' ? 'active' : ''}`} 
            onClick={() => setCustomerViewMode(prev => prev === 'cart' ? 'menu' : 'cart')} 
            title={customerViewMode === 'cart' ? 'Tampilkan Menu di Layar Pelanggan' : 'Tampilkan Keranjang di Layar Pelanggan'}
            style={{background: customerViewMode === 'menu' ? 'var(--primary)' : 'var(--primary-soft)', color: customerViewMode === 'menu' ? 'white' : 'var(--primary)'}}
          >
            <IconMenu />
          </button>
          <button className="nav-link" onClick={toggleDarkMode} style={{background: 'var(--primary-soft)', color: 'var(--primary)'}}>
            {isDark ? <IconSun /> : <IconMoon />}
          </button>
          <button className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} title="Pengaturan">
            <IconSettings />
          </button>
          
          <div style={{width: '70%', height: '1px', background: 'var(--border)', margin: '0.5rem 0'}}></div>

          <button className="nav-link" onClick={handleLogout} title="Ganti Kasir (Shift Change)" style={{color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)'}}>
            <IconUsers />
          </button>
          <button className="nav-link" onClick={handleExit} title="Keluar Aplikasi" style={{color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)'}}>
            <IconPower />
          </button>

          <div style={{marginTop: '1rem', padding: '0.8rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', width: 'calc(100% - 1rem)', textAlign: 'center'}}>
            <div style={{fontWeight: 800, fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)'}}>{activeCashier}</div>
            <div style={{fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 700}}>Luma POS</div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard settings={settings} />}

        {activeTab === 'pos' && (
          <>
            <header className="header-minimal">
              <div>
                <h1>{settings.store_name}</h1>
                <p style={{color: 'var(--text-muted)'}}>{settings.storeAddress}</p>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                <input 
                  type="text" 
                  placeholder="Cari produk... (Ctrl+K)" 
                  className="search-box"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </header>
            {heldOrders.length > 0 && (
              <div className="held-orders-bar">
                {heldOrders.map(h => (
                  <div key={h.id} className="held-order-chip" onClick={() => resumeOrder(h.id)}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><Pause size={14} /> {h.customerName}</span>
                    <span style={{opacity:0.7}}>Rp {h.total.toLocaleString()}</span>
                    <button onClick={e => {e.stopPropagation();removeHeldOrder(h.id)}} style={{background:'transparent',border:'none',color:'var(--danger)',fontWeight:800,cursor:'pointer',padding:'0 4px',display:'flex',alignItems:'center'}}><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}

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
                {(() => {
                  const filtered = products
                    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
                    .filter(p => selectedCategory === 'Semua' || (p.category && p.category.split(',').map(c => c.trim()).includes(selectedCategory)));

                  if (filtered.length === 0) {
                    return (
                      <div style={{
                        gridColumn: '1 / -1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8rem 2rem',
                        background: 'var(--bg-card)',
                        borderRadius: '32px',
                        border: '2px dashed var(--border)',
                        textAlign: 'center',
                        gap: '1.5rem'
                      }}>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          background: 'var(--primary-soft)',
                          color: 'var(--primary)',
                          borderRadius: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: 'scale(1.5)'
                        }}>
                          <IconBox />
                        </div>
                        <div>
                          <h3 style={{fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem'}}>
                            {products.length === 0 ? 'Belum Ada Produk' : 'Produk Tidak Ditemukan'}
                          </h3>
                          <p style={{color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '300px', margin: '0 auto'}}>
                            {products.length === 0 
                              ? 'Silahkan tambahkan produk baru di menu Stok untuk mulai berjualan.' 
                              : `Tidak ada hasil untuk "${search}" di kategori ini.`}
                          </p>
                        </div>
                        {products.length === 0 && (
                          <button 
                            onClick={() => setActiveTab('stock')}
                            style={{
                              marginTop: '1rem',
                              padding: '0.8rem 2rem',
                              background: 'var(--primary)',
                              color: 'white',
                              borderRadius: '12px',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Buka Menu Stok
                          </button>
                        )}
                      </div>
                    );
                  }

                  return filtered.map(p => (
                    <div key={p.id} className="product-card" onClick={() => {
                      if (p.variants && p.variants.trim() !== '') {
                        setProductToSelectVariant(p);
                      } else {
                        addToCart(p);
                      }
                    }}>
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
                  ));
                })()}
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <div style={{background: 'var(--bg-card)', padding: '3rem', borderRadius: '32px', flex: 1, boxShadow: 'var(--shadow-main)', overflowY: 'auto'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <h2 style={{fontSize: '2rem'}}>Histori Penjualan</h2>
                <button 
                  onClick={exportToExcel}
                  style={{background: 'var(--primary-soft)', color: 'var(--primary)', padding: '0.8rem 1.5rem', fontWeight: 700, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                >
                  <Download size={18} /> Ekspor ke Excel (.xlsx)
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
                        <div style={{fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700}}>{t.payment_method || 'Cash'}</div>
                      </td>
                    <td style={{fontFamily: 'monospace'}}>#transaction-{t.id}</td>
                    <td style={{fontWeight: 600}}>{t.customer_name} {t.member_id ? '(Member)' : ''}</td>
                    <td style={{fontWeight: 700, color: 'var(--primary)'}}>Rp {t.total.toLocaleString()}</td>
                    <td style={{textAlign: 'right', borderRadius: '0 16px 16px 0', paddingRight: '1.5rem'}}>
                      <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
                        <button 
                          title="Lihat Struk"
                          style={{background: 'var(--primary-soft)', color: 'var(--primary)', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all 0.2s'}}
                          onClick={() => {
                            setLastTransaction(t);
                            setShowReceipt(true);
                          }}
                          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <IconEye />
                        </button>
                        <button className="btn-circle" style={{color: '#ef4444'}} onClick={() => {
                          customConfirm('Hapus Transaksi', 'Hapus transaksi ini?', async () => {
                            await supabase.from('transactions').delete().eq('id', t.id);
                            fetchTransactions();
                          });
                        }}>
                          <IconTrash />
                        </button>
                      </div>
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
          <div style={{background: 'var(--bg-card)', padding: '3rem', borderRadius: '32px', flex: 1, boxShadow: 'var(--shadow-main)', overflowY: 'auto'}}>
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
              const { error } = await supabase.from('products').insert({ ...formData, price: parseInt(formData.price), stock: parseInt(formData.stock) });
              if (!error) {
                setFormData({ name: '', price: '', stock: '', category: '', variants: '', image: '' }); 
                fetchProducts();
                showToast('Produk berhasil ditambahkan!');
              }
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
              <input 
                style={{flex: 1, padding: '1.2rem', fontSize: '1.1rem'}} 
                placeholder="Varian (Pisahkan dengan koma, misal: Hot, Ice)" 
                value={formData.variants} 
                onChange={e => setFormData({...formData, variants: e.target.value})} 
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
                      <div style={{fontSize: '0.8rem', opacity: 0.6}}>
                        {p.category || 'Tanpa Kategori'} 
                        {p.variants && <span style={{marginLeft: '0.5rem', color: 'var(--primary)', fontWeight: 700}}>• {p.variants}</span>}
                      </div>
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
                      <button style={{color: '#ef4444', background: '#fef2f2', padding: '0.5rem 1rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 700}} onClick={() => {
                        customConfirm('Hapus Produk', 'Hapus produk ini?', async () => {
                          await supabase.from('products').delete().eq('id', p.id);
                          fetchProducts();
                        });
                      }}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'members' && (
          <div style={{background: 'var(--bg-card)', padding: '3rem', borderRadius: '32px', flex: 1, boxShadow: 'var(--shadow-main)', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h2 style={{fontSize: '2rem'}}>Manajemen Member</h2>
              <input 
                type="text" 
                placeholder="Cari nama atau nomor HP member..." 
                className="search-box"
                style={{width: '350px'}}
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
              />
            </div>
            
            <form style={{display: 'flex', gap: '1.25rem', marginBottom: '4rem'}} onSubmit={async (e) => {
              e.preventDefault();
              const { error } = await supabase.from('members').insert({ ...memberFormData });
              if (!error) {
                setMemberFormData({ name: '', phone: '' }); 
                fetchMembers();
                showToast('Member baru berhasil didaftarkan!');
              } else {
                showToast('Gagal daftar member (Mungkin nomor HP sudah ada)', 'error');
              }
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
                      <button style={{color: '#ef4444', background: '#fef2f2', padding: '0.5rem 1rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 700}} onClick={() => {
                        customConfirm('Hapus Member', 'Hapus member ini?', async () => {
                          await supabase.from('members').delete().eq('id', m.id);
                          fetchMembers();
                        });
                      }}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            updateSetting={updateSetting}
            rgb={rgb}
            setRgb={setRgb}
            isRgbUserChange={isRgbUserChange}
            rgbToHex={rgbToHex}
            hexToRgb={hexToRgb}
            appVersion={pkg.version}
            isCheckingUpdate={isCheckingUpdate}
            setIsCheckingUpdate={setIsCheckingUpdate}
            updateMessage={updateMessage}
            setUpdateMessage={setUpdateMessage}
          />
        )}
      </main>

      {/* Checkout Sidebar  (Show only during POS) */}
      {activeTab === 'pos' && (
        <aside className="checkout-sidebar" key={checkoutKey}>
          <h2 style={{fontSize: '1.5rem', fontWeight: 700}}>Detail Pesanan</h2>
          
          <div className="order-list">
            {cart.length === 0 ? (
              <div style={{textAlign: 'center', marginTop: '6rem', opacity: 0.2, animation: 'fadeIn 0.5s ease-out'}}>
                <div style={{marginBottom: '1.5rem', display: 'flex', justifyContent: 'center'}}>
                  <IconCart size={80} />
                </div>
                <p style={{fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)'}}>Keranjang masih kosong</p>
                <p style={{fontSize: '0.85rem', marginTop: '0.5rem'}}>Pilih produk di sebelah kiri untuk memulai</p>
              </div>
            ) : (
               cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="item-row">
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 600}}>
                      {item.name}
                      {item.selectedVariant && <span style={{color: 'var(--primary)', marginLeft: '0.4rem'}}>({item.selectedVariant})</span>}
                    </div>
                    <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Rp {item.price.toLocaleString()}</div>
                  </div>
                  <div className="item-qty-pill">
                    <button className="btn-circle" onClick={() => updateQty(item.id, item.selectedVariant, -1)}>-</button>
                    <span style={{fontWeight: 700, minWidth: '20px', textAlign: 'center'}}>{item.qty}</span>
                    <button className="btn-circle" onClick={() => updateQty(item.id, item.selectedVariant, 1)}>+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
            <div>
              <p style={{fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-muted)'}}>CASHIER</p>
              <input 
                type="text" 
                placeholder="Nama Kasir" 
                style={{width: '100%', padding: '0.7rem', fontSize: '0.9rem', borderRadius: '10px'}}
                value={activeCashier}
                onChange={e => setActiveCashier(e.target.value)}
              />
            </div>
            <div>
              <p style={{fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-muted)'}}>CAPTAIN</p>
              <input 
                type="text" 
                placeholder="Waiter / Cap" 
                style={{width: '100%', padding: '0.7rem', fontSize: '0.9rem', borderRadius: '10px'}}
                value={activeCaptain}
                onChange={e => setActiveCaptain(e.target.value)}
              />
            </div>
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
                  boxShadow: '0 4px 10px var(--primary-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Check size={12} /> {activeMember.name}
                </div>
              )}
            </div>
          </div>

          <div style={{marginBottom: '1rem'}}>
            <p style={{fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-muted)'}}>CATATAN PESANAN</p>
            <textarea
              placeholder="Tambahkan catatan..."
              style={{width:'100%',padding:'0.8rem',fontSize:'0.9rem',borderRadius:'12px',border:'1px solid var(--border)',background:'var(--bg-app)',color:'var(--text-main)',resize:'none',height:'60px',fontFamily:'inherit'}}
              value={transactionNotes}
              onChange={e => setTransactionNotes(e.target.value)}
            />
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
                  onClick={() => {
                    setPaymentMethod(m.name);
                    if (m.name !== 'QRIS') setShowQRISModal(false);
                  }}
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
            <button className="btn-checkout" onClick={handleCheckout} style={{
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
            {cart.length > 0 && (
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem'}}>
                <button
                  onClick={sendToKitchen}
                  style={{padding:'0.8rem',background:'var(--primary-soft)',color:'var(--primary)',fontWeight:700,border:'1px solid var(--primary)',borderRadius:'16px',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',cursor:'pointer'}}
                >
                  <Pause size={18} /> KE DAPUR
                </button>
                <button
                  onClick={holdCurrentOrder}
                  style={{padding:'0.8rem',background:'var(--warning-soft,rgba(245,158,11,0.1))',color:'var(--warning,#f59e0b)',fontWeight:700,border:'1px solid var(--warning,#f59e0b)',borderRadius:'16px',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',cursor:'pointer'}}
                >
                  <Pause size={18} /> TAHAN (Ctrl+H)
                </button>
              </div>
            )}
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
              <h2 style={{fontSize: '1.5rem', fontWeight: 800}}>{settings.store_name}</h2>
              <p style={{fontSize: '0.8rem', marginBottom: '2rem'}}>{settings.store_address}</p>
              
              <div style={{textAlign: 'left', borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc', padding: '1.5rem 0', margin: '1.5rem 0'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem'}}>
                  <span>ID Transaksi:</span>
                  <span>#transaction-{lastTransaction.id}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem'}}>
                  <span>Nama Customer:</span>
                  <span>{lastTransaction.customer_name}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.8rem'}}>
                  <span>Waktu:</span>
                  <span>{new Date(lastTransaction.timestamp).toLocaleString()}</span>
                </div>
                
                {lastTransaction.items?.map((item, idx) => (
                  <div key={idx} style={{marginBottom: '0.5rem'}}>
                    <div style={{fontWeight: 700}}>
                      {item.name}
                      {item.variant && <span style={{marginLeft: '0.3rem'}}>({item.variant})</span>}
                    </div>
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
                  <span>{lastTransaction.payment_method}</span>
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
                onClick={() => { setShowReceipt(false); if (activeTab === 'pos') window.location.reload(); }}
                style={{flex: 1, padding: '1.2rem', background: '#f3f4f6', color: '#000', borderRadius: '16px', fontWeight: 700}}
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal  */}
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
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <label style={{fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)'}}>VARIAN (PISAHKAN DENGAN KOMA)</label>
                <input 
                  style={{padding: '1.2rem'}}
                  value={editingProduct.variants || ''}
                  onChange={e => setEditingProduct({...editingProduct, variants: e.target.value})}
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
      {/* Variant Selection Modal */}
      {productToSelectVariant && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background: 'var(--bg-card)', width: '450px', padding: '3rem', borderRadius: '32px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', border: '1px solid var(--border)'}}>
            <div style={{width: '60px', height: '60px', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>
               <IconTag />
            </div>
            <h2 style={{fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem'}}>Pilih Varian</h2>
            <p style={{color: 'var(--text-muted)', marginBottom: '2.5rem'}}>{productToSelectVariant.name}</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {productToSelectVariant.variants.split(',').map(variant => (
                <button 
                  key={variant}
                  onClick={() => addToCart(productToSelectVariant, variant.trim())}
                  style={{
                    padding: '1.2rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-app)',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                >
                  {variant.trim()}
                </button>
              ))}
              <button 
                onClick={() => setProductToSelectVariant(null)}
                style={{marginTop: '1rem', padding: '1rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer'}}
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Update Notification Banner */}
      {updateInfo && (
        <div style={{
          position: 'fixed', bottom: '30px', left: '100px', zIndex: 9999,
          background: 'var(--bg-card)', color: 'var(--text-main)', padding: '1.5rem',
          borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
          width: '400px', border: '2px solid var(--primary)',
          display: 'flex', gap: '1.5rem', alignItems: 'center',
          animation: 'slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{width: '60px', height: '60px', background: 'var(--primary)', color: 'white', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
            <IconPower />
          </div>
          <div style={{flex: 1}}>
            <div style={{fontWeight: 800, fontSize: '1.1rem'}}>
              {updateStatus === 'available' && `Update v${updateInfo.version || ''} Tersedia!`}
              {updateStatus === 'downloading' && 'Mengunduh Pembaruan...'}
              {updateStatus === 'ready' && 'Pembaruan Siap Dipasang!'}
            </div>
            <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem'}}>
              {updateStatus === 'available' && (updateInfo.changelog || 'Pembaruan sistem terbaru untuk performa yang lebih baik.')}
              {updateStatus === 'downloading' && 'Mohon tunggu sebentar, aplikasi sedang mengunduh versi terbaru.'}
              {updateStatus === 'ready' && 'Aplikasi perlu dimulai ulang untuk menerapkan pembaruan.'}
            </div>
            <div style={{display: 'flex', gap: '0.8rem'}}>
              {updateStatus === 'available' && (
                <button 
                  onClick={startUpdateDownload}
                  style={{flex: 1, padding: '0.6rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'}}
                >
                  Download & Install
                </button>
              )}
              {updateStatus === 'downloading' && (
                <button 
                  disabled
                  style={{flex: 1, padding: '0.6rem', background: 'var(--primary-soft)', color: 'var(--primary)', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', opacity: 0.7}}
                >
                  Downloading...
                </button>
              )}
              {updateStatus === 'ready' && (
                <button 
                  onClick={restartAndInstall}
                  style={{flex: 1, padding: '0.6rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'}}
                >
                  Restart & Update
                </button>
              )}
              <button 
                onClick={() => setUpdateInfo(null)}
                style={{padding: '0.6rem 1rem', background: 'var(--bg-app)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer'}}
              >
                Nanti
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Cash Calculator Modal */}
      {showCashCalc && (
        <CashCalculator
          total={total}
          onConfirm={(cashAmount, change) => {
            setShowCashCalc(false);
            handleCheckout();
          }}
          onClose={() => { setShowCashCalc(false); setIsProcessing(false); }}
        />
      )}
      {/* Toast Notification  */}
      {toast && (
        <div style={{
          position: 'fixed', top: '40px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 10000, background: 'var(--bg-card)', padding: '1rem 2rem',
          borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: `1px solid ${toast.type === 'success' ? '#22c55e' : '#ef4444'}`,
          display: 'flex', alignItems: 'center', gap: '1rem',
          animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: toast.type === 'success' ? '#22c55e' : '#ef4444',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {toast.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
          </div>
          <span style={{fontWeight: 700, color: 'var(--text-main)'}}>{toast.message}</span>
        </div>
      )}
      {/* Custom Dialog (Alert/Confirm) */}
      {dialog && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10001,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '32px',
            border: '1px solid var(--border)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
            width: '400px', textAlign: 'center', animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '20px', 
              background: dialog.type === 'confirm' ? 'var(--primary-soft)' : 'var(--danger-soft)',
              color: dialog.type === 'confirm' ? 'var(--primary)' : 'var(--danger)',
              margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {dialog.type === 'confirm' ? <Check size={32} /> : <AlertTriangle size={32} />}
            </div>
            <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)'}}>{dialog.title}</h3>
            <p style={{color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.5}}>{dialog.message}</p>
            
            <div style={{display: 'flex', gap: '1rem'}}>
              {dialog.type === 'confirm' && (
                <button 
                  onClick={() => setDialog(null)}
                  style={{flex: 1, padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer'}}
                >
                  BATAL
                </button>
              )}
              <button 
                onClick={() => {
                  if (dialog.onConfirm) dialog.onConfirm();
                  setDialog(null);
                  // Auto-refocus search box to ensure inputs continue working
                  setTimeout(() => document.querySelector('.search-box')?.focus(), 100);
                }}
                style={{
                  flex: 1, padding: '1rem', borderRadius: '16px', border: 'none', 
                  background: dialog.type === 'confirm' ? 'var(--primary)' : 'var(--danger)', 
                  color: 'white', fontWeight: 800, cursor: 'pointer',
                  boxShadow: dialog.type === 'confirm' ? '0 10px 20px -5px var(--primary-soft)' : '0 10px 20px -5px rgba(239,68,68,0.3)'
                }}
              >
                {dialog.type === 'confirm' ? 'YA, LANJUTKAN' : 'OK'}
              </button>
            </div>
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

  // Jika URL mengandung kata kitchen-view, tampilkan layar dapur
  if (view.includes('kitchen-view')) {
    return <KitchenDisplay />;
  }
  
  return <App />;
}

export default Main;
