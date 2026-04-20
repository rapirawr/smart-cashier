import React, { useState } from 'react';
import pkg from '../../package.json';
import { Store, DollarSign, Monitor, Palette, Cog, RefreshCcw, ExternalLink, Star } from 'lucide-react';

function Settings({ settings, updateSetting, rgb, setRgb, isRgbUserChange, rgbToHex, hexToRgb, appVersion, isCheckingUpdate, setIsCheckingUpdate, updateMessage, setUpdateMessage }) {
  const [activeSection, setActiveSection] = useState('store');

  const sections = [
    { id: 'store', label: 'Informasi Toko', icon: <Store size={18} />, desc: 'Nama, alamat, dan identitas toko' },
    { id: 'finance', label: 'Keuangan & Pajak', icon: <DollarSign size={18} />, desc: 'Pengaturan pajak dan diskon' },
    { id: 'display', label: 'Layar Pelanggan', icon: <Monitor size={18} />, desc: 'Konfigurasi tampilan pelanggan' },
    { id: 'theme', label: 'Personalisasi Tema', icon: <Palette size={18} />, desc: 'Warna dan tampilan aplikasi' },
    { id: 'system', label: 'Sistem & Update', icon: <Cog size={18} />, desc: 'Pembaruan dan info aplikasi' },
  ];

  return (
    <div className="panel" style={{padding: 0, overflow: 'hidden', height: '100%'}}>
      <div className="settings-layout">
        {/* Settings Sidebar */}
        <div className="settings-sidebar">
          <div style={{padding: '0 1rem', marginBottom: '1.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800}}>Pengaturan</h2>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem'}}>Kelola konfigurasi sistem</p>
          </div>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                padding: '1rem 1.2rem',
                borderRadius: '14px',
                background: activeSection === s.id ? 'var(--primary-soft)' : 'transparent',
                border: activeSection === s.id ? '1px solid var(--primary)' : '1px solid transparent',
                color: activeSection === s.id ? 'var(--primary)' : 'var(--text-main)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <span style={{opacity: 0.8}}>{s.icon}</span>
                <div style={{fontWeight: 700, fontSize: '0.95rem'}}>{s.label}</div>
              </div>
              <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', paddingLeft: '2.1rem'}}>{s.desc}</div>
            </button>
          ))}
          <div style={{marginTop: 'auto', padding: '1rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)'}}>
            <div style={{fontWeight: 800, fontSize: '1rem'}}>Kaze POS</div>
            <div style={{fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700}}>v{pkg.version}</div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {activeSection === 'store' && (
            <div style={{animation: 'fadeIn 0.3s ease-out'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}><Store /> Informasi Toko</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px'}}>
                <div className="form-group">
                  <label className="form-label">NAMA TOKO</label>
                  <input className="form-input" value={settings.store_name} onChange={e => updateSetting('store_name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">ALAMAT LENGKAP</label>
                  <input className="form-input" value={settings.store_address} onChange={e => updateSetting('store_address', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">TEKS UCAPAN (WELCOME)</label>
                  <input className="form-input" value={settings.welcome_text || 'Selamat Datang / Welcome'} onChange={e => updateSetting('welcome_text', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'finance' && (
            <div style={{animation: 'fadeIn 0.3s ease-out'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}><DollarSign /> Keuangan & Pajak</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px'}}>
                <div className="form-group">
                  <label className="form-label">PERSENTASE PAJAK (%)</label>
                  <input className="form-input" type="number" value={settings.tax_rate} onChange={e => updateSetting('tax_rate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">DISKON MEMBER (%)</label>
                  <input className="form-input" type="number" value={settings.member_discount} onChange={e => updateSetting('member_discount', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">URL GAMBAR QRIS (MANUAL)</label>
                  <input className="form-input" type="text" placeholder="https://link-gambar-qris-anda.com/qris.jpg" value={settings.qris_image || ''} onChange={e => updateSetting('qris_image', e.target.value)} />
                  <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Upload gambar QRIS ke hosting gambar lalu tempel link-nya di sini.</p>
                </div>
                {settings.qris_image && (
                  <div style={{background: 'white', padding: '1rem', borderRadius: '16px', display: 'inline-flex', border: '1px solid var(--border)'}}>
                    <img src={settings.qris_image} alt="QRIS Preview" style={{width: '150px', borderRadius: '8px'}} />
                  </div>
                )}

                {/* Points System */}
                <div style={{
                  marginTop: '1rem', padding: '2rem', borderRadius: '20px',
                  background: settings.points_enabled ? 'var(--primary-soft)' : 'var(--bg-app)',
                  border: `2px solid ${settings.points_enabled ? 'var(--primary)' : 'var(--border)'}`,
                  transition: 'all 0.3s'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: settings.points_enabled ? '1.5rem' : 0}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '12px',
                        background: settings.points_enabled ? 'var(--primary)' : 'var(--border)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s'
                      }}>
                        <Star size={20} />
                      </div>
                      <div>
                        <div style={{fontWeight: 700, fontSize: '1.1rem'}}>Sistem Poin Member</div>
                        <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Member dapat mengumpulkan dan menukarkan poin</div>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSetting('points_enabled', !settings.points_enabled)}
                      style={{
                        width: '56px', height: '30px', borderRadius: '15px', border: 'none', cursor: 'pointer',
                        background: settings.points_enabled ? 'var(--primary)' : 'var(--border)',
                        position: 'relative', transition: 'all 0.3s'
                      }}
                    >
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%', background: 'white',
                        position: 'absolute', top: '3px',
                        left: settings.points_enabled ? '29px' : '3px',
                        transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }} />
                    </button>
                  </div>
                  {settings.points_enabled && (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
                      <div className="form-group">
                        <label className="form-label">POIN PER RUPIAH (Setiap berapa rupiah = 1 poin)</label>
                        <input className="form-input" type="number" min="100" step="100"
                          value={settings.points_per_rupiah || 1000}
                          onChange={e => updateSetting('points_per_rupiah', parseInt(e.target.value) || 1000)}
                        />
                        <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                          Contoh: 1000 = Setiap belanja Rp 1.000 mendapat 1 poin
                        </p>
                      </div>
                      <div className="form-group">
                        <label className="form-label">NILAI TUKAR POIN (1 poin = berapa Rupiah)</label>
                        <input className="form-input" type="number" min="100" step="100"
                          value={settings.points_value || 500}
                          onChange={e => updateSetting('points_value', parseInt(e.target.value) || 500)}
                        />
                        <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                          Contoh: 500 = 1 poin bisa ditukar untuk potongan Rp 500
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'display' && (
            <div style={{animation: 'fadeIn 0.3s ease-out'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}><Monitor /> Layar Pelanggan</h3>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '20px',
                border: '1px solid var(--border)', marginBottom: '1.5rem'
              }}>
                <div>
                  <div style={{fontWeight: 700, fontSize: '1.1rem'}}>Kitchen Display System (KDS)</div>
                  <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem'}}>Buka layar monitor untuk bagian dapur/kitchen.</p>
                </div>
                <button
                  onClick={() => window.open(window.location.origin + window.location.pathname + '#kitchen-view', '_blank', 'width=1200,height=800')}
                  className="btn btn-soft"
                  style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                >
                  Buka Monitor Dapur <ExternalLink size={16} />
                </button>
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '20px',
                border: '1px solid var(--border)', marginBottom: '1.5rem'
              }}>
                <div>
                  <div style={{fontWeight: 700, fontSize: '1.1rem'}}>Status Layar Pelanggan</div>
                  <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem'}}>Aktifkan atau matikan tampilan layar untuk pelanggan.</p>
                </div>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                  <button
                    onClick={() => window.open(window.location.origin + window.location.pathname + '#customer-view', '_blank', 'width=1200,height=800')}
                    className="btn btn-soft"
                    style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                  >
                    Buka Layar <ExternalLink size={16} />
                  </button>
                  <button
                    onClick={() => updateSetting('is_customer_display_on', settings.is_customer_display_on === false ? true : false)}
                    className="btn"
                    style={{
                      background: settings.is_customer_display_on === false ? 'var(--danger)' : 'var(--success)',
                      color: 'white', minWidth: '140px',
                      boxShadow: settings.is_customer_display_on === false ? '0 10px 15px -3px rgba(239,68,68,0.3)' : '0 10px 15px -3px rgba(34,197,94,0.3)'
                    }}
                  >
                    {settings.is_customer_display_on === false ? 'MATI' : 'AKTIF'}
                  </button>
                </div>
              </div>

              <div style={{marginTop: '3rem'}}>
                <h4 style={{fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem'}}>Pilih Template Tampilan Pelanggan</h4>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem'}}>
                  {[
                    { id: 'classic', name: 'Classic List', desc: 'Daftar item bersih dengan ringkasan di bawah.' },
                    { id: 'split', name: 'Split Screen', desc: 'Item di kiri, Total besar di kanan (Fokus Harga).' },
                    { id: 'modern', name: 'Modern Center', desc: 'Total di tengah atas, item di bawah (Minimalis).' },
                    { id: 'visual', name: 'Visual Grid', desc: 'Menampilkan item dengan gambar produk (Grid).' },
                    { id: 'banner', name: 'Full Banner', desc: 'Fokus pada total harga dengan ukuran raksasa.' }
                  ].map(tpl => (
                    <div 
                      key={tpl.id}
                      onClick={() => updateSetting('displayTemplate', tpl.id)}
                      style={{
                        padding: '1.5rem', borderRadius: '24px', 
                        border: `2px solid ${settings.displayTemplate === tpl.id ? 'var(--primary)' : 'var(--border)'}`,
                        background: settings.displayTemplate === tpl.id ? 'var(--primary-soft)' : 'var(--bg-card)',
                        cursor: 'pointer', transition: 'all 0.3s',
                        boxShadow: settings.displayTemplate === tpl.id ? '0 10px 20px -5px var(--primary-soft)' : 'none'
                      }}
                    >
                      <div style={{
                        width: '100%', height: '100px', background: 'var(--bg-app)', 
                        borderRadius: '12px', marginBottom: '1rem', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-muted)'
                      }}>
                         [ Preview {tpl.name} ]
                      </div>
                      <div style={{fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem', color: settings.displayTemplate === tpl.id ? 'var(--primary)' : 'var(--text-main)'}}>{tpl.name}</div>
                      <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4}}>{tpl.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'theme' && (
            <div style={{animation: 'fadeIn 0.3s ease-out'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}><Palette /> Personalisasi Tema</h3>
              <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem'}}>Atur warna tema sesuai brand toko kamu:</p>

              <div style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem', background: 'var(--bg-app)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)'}}>
                <div style={{position: 'relative', flexShrink: 0}}>
                  <div style={{
                    width: '90px', height: '90px', borderRadius: '22px',
                    background: rgbToHex(rgb.r, rgb.g, rgb.b),
                    boxShadow: `0 12px 30px ${rgbToHex(rgb.r, rgb.g, rgb.b)}55`,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '4px solid white', transition: 'all 0.2s'
                  }}>
                    <input type="color" value={rgbToHex(rgb.r, rgb.g, rgb.b)}
                      onChange={e => { isRgbUserChange.current = true; setRgb(hexToRgb(e.target.value)); }}
                      style={{position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer'}}
                    />
                    <div style={{fontSize: '1.5rem', filter: 'invert(1) grayscale(1) contrast(9)'}}><Palette size={32} /></div>
                  </div>
                  <div style={{position: 'absolute', bottom: '-10px', right: '-10px', background: 'var(--primary)', color: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800}}>PICK</div>
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem'}}>Warna Aktif</div>
                  <div style={{display: 'flex', alignItems: 'baseline', gap: '1rem'}}>
                    <div style={{fontFamily: 'monospace', fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)'}}>{rgbToHex(rgb.r, rgb.g, rgb.b).toUpperCase()}</div>
                    <div style={{fontSize: '1rem', color: 'var(--text-muted)'}}>rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
                  </div>
                </div>
              </div>

              <div>
                <p style={{fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem'}}>PRESET CEPAT</p>
                <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                  {[
                    {name:'Indigo',r:99,g:102,b:241},{name:'Emerald',r:16,g:185,b:129},
                    {name:'Rose',r:244,g:63,b:94},{name:'Amber',r:245,g:158,b:11},
                    {name:'Violet',r:139,g:92,b:246},{name:'Sky',r:14,g:165,b:233},
                    {name:'Teal',r:20,g:184,b:166},{name:'Pink',r:236,g:72,b:153}
                  ].map(preset => (
                    <button key={preset.name}
                      onClick={() => { isRgbUserChange.current = true; setRgb({r:preset.r,g:preset.g,b:preset.b}); }}
                      title={preset.name}
                      style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: rgbToHex(preset.r, preset.g, preset.b),
                        border: (rgb.r===preset.r&&rgb.g===preset.g&&rgb.b===preset.b) ? '3px solid var(--text-main)' : '2px solid transparent',
                        cursor: 'pointer', transition: 'transform 0.15s',
                        transform: (rgb.r===preset.r&&rgb.g===preset.g&&rgb.b===preset.b) ? 'scale(1.3)' : 'scale(1)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'system' && (
            <div style={{animation: 'fadeIn 0.3s ease-out'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}><Cog /> Sistem & Update</h3>
              <div style={{
                background: 'var(--bg-app)', padding: '2rem', borderRadius: '20px',
                border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <div style={{fontWeight: 700, fontSize: '1.1rem'}}>Cek Pembaruan Perangkat Lunak</div>
                  <div style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Versi saat ini: {appVersion}</div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  {updateMessage && (
                    <div style={{fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, animation: 'fadeIn 0.3s ease-out'}}>{updateMessage}</div>
                  )}
                  <button
                    disabled={isCheckingUpdate}
                    onClick={() => {
                      if (window.require) {
                        const { ipcRenderer } = window.require('electron');
                        ipcRenderer.send('manual_check');
                        setIsCheckingUpdate(true);
                      }
                    }}
                    className="btn"
                    style={{
                      padding: '1rem 2rem',
                      background: isCheckingUpdate ? 'var(--border)' : 'var(--primary-soft)',
                      color: isCheckingUpdate ? 'var(--text-muted)' : 'var(--primary)',
                      cursor: isCheckingUpdate ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.8rem'
                    }}
                  >
                    {isCheckingUpdate ? (<><div className="spinner-mini" style={{borderTopColor: 'var(--text-muted)'}}></div>Mengecek...</>) : 'Cek Update Sekarang'}
                  </button>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-app)', padding: '2rem', borderRadius: '20px',
                border: '1px solid var(--border)', marginBottom: '1.5rem'
              }}>
                <h4 style={{fontWeight: 700, marginBottom: '1rem'}}>Informasi Aplikasi</h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  {[
                    ['Nama Aplikasi', 'Kaze POS'],
                    ['Versi', pkg.version],
                    ['Platform', 'Electron + React'],
                    ['Database', 'Supabase'],
                    ['Developer', pkg.author || 'Developer'],
                    ['Lisensi', 'Proprietary'],
                  ].map(([label, value]) => (
                    <div key={label} style={{padding: '1rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)'}}>
                      <div style={{fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase'}}>{label}</div>
                      <div style={{fontWeight: 700, marginTop: '0.3rem'}}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
                style={{width: '100%', padding: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'}}
              >
                <RefreshCcw size={24} /> REFRESH APLIKASI
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
