import React, { useState, useEffect } from 'react';
import { Check, Clock, Utensils, User, ChefHat, Play, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import '../App.css';

function KitchenDisplay() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('preparing'); // preparing, ready
  const [settings, setSettings] = useState(null);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .in('status', ['preparing', 'ready'])
      .order('timestamp', { ascending: false });
    
    if (!error) setOrders(data);
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('settings').select('*').single();
    if (!error && data) {
      setSettings(data);
      applyTheme(data.primary_color, data.is_dark);
    }
  };

  const applyTheme = (color, isDark) => {
    if (color) {
      document.documentElement.style.setProperty('--primary', color);
      const softColor = color.length === 7 ? color + '26' : color; 
      document.documentElement.style.setProperty('--primary-soft', softColor);
    }
    
    if (isDark !== undefined) {
      if (isDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchSettings();

    // 1. Supabase Real-time Subscription (Orders)
    const orderSub = supabase
      .channel('kitchen_orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        console.log('Real-time Order Update:', payload);
        fetchOrders();
      })
      .subscribe((status) => {
        console.log('Order Subscription Status:', status);
      });

    // 2. Supabase Real-time Subscription (Settings/Theme)
    const settingsSub = supabase
      .channel('settings_sync')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings' }, (payload) => {
        setSettings(payload.new);
        applyTheme(payload.new.primary_color, payload.new.is_dark);
      })
      .subscribe();

    // 3. BroadcastChannel for same-browser sync
    const bc = new BroadcastChannel('kitchen_display');
    bc.onmessage = () => fetchOrders();

    return () => {
      supabase.removeChannel(orderSub);
      supabase.removeChannel(settingsSub);
      bc.close();
    };
  }, []);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('transactions')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) {
      fetchOrders();
      const bc = new BroadcastChannel('kitchen_display');
      bc.postMessage({ type: 'UPDATE' });
    }
  };

  const getTimeElapsed = (timestamp) => {
    const diff = Math.floor((new Date() - new Date(timestamp)) / 60000);
    return diff > 60 ? `${Math.floor(diff/60)}h ${diff%60}m` : `${diff}m`;
  };

  return (
    <div className="kitchen-container" style={{
      background: 'var(--bg-app)', 
      minHeight: '100vh', 
      padding: '2rem',
      color: 'var(--text-main)'
    }}>
      <header style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '3rem',
        background: 'var(--bg-card)',
        padding: '1.5rem 2.5rem',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-main)',
        border: '1px solid var(--border)'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '16px',
            background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ChefHat size={28} />
          </div>
          <div>
            <h1 style={{fontSize: '1.5rem', fontWeight: 800, margin: 0}}>Kitchen Display System</h1>
            <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600}}>Monitor Pesanan Real-time</div>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '0.75rem', background: 'var(--bg-app)', padding: '0.5rem', borderRadius: '16px'}}>
          <button 
            onClick={() => setFilter('preparing')}
            style={{
              padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 700,
              background: filter === 'preparing' ? 'var(--primary)' : 'transparent',
              color: filter === 'preparing' ? 'white' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            Antrean ({orders.filter(o => o.status === 'preparing').length})
          </button>
          <button 
            onClick={() => setFilter('ready')}
            style={{
              padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 700,
              background: filter === 'ready' ? 'var(--success)' : 'transparent',
              color: filter === 'ready' ? 'white' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            Selesai ({orders.filter(o => o.status === 'ready').length})
          </button>
        </div>
      </header>

      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '2rem'
      }}>
        {orders.filter(o => o.status === filter).map((order, idx) => (
          <div key={order.id} style={{
            background: 'var(--bg-card)',
            borderRadius: '28px',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            animation: 'fadeIn 0.3s ease-out',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--border)',
              background: order.status === 'ready' ? 'var(--success-soft)' : 'transparent',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem'}}>
                  <div style={{
                    background: 'var(--primary)', color: 'white',
                    borderRadius: '8px', padding: '0.1rem 0.6rem',
                    fontSize: '0.75rem', fontWeight: 800
                  }}>
                    #{order.id.slice(0, 8)} • {order.payment_method}
                  </div>
                </div>
                <h3 style={{margin: 0, fontSize: '1.35rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <User size={16} style={{color: 'var(--primary)'}} />
                  {order.customerName || 'Tamu'}<span style={{color: 'var(--primary)', fontFamily: 'monospace'}}>#{order.id.slice(0, 4).toUpperCase()}</span>
                </h3>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem'}}>
                   <span>Capt: {order.captain_name || 'Self'}</span>
                </div>
              </div>
              <div style={{
                background: 'var(--bg-app)', 
                padding: '0.5rem 0.8rem', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: (new Date() - new Date(order.timestamp)) > 600000 ? 'var(--danger)' : 'var(--text-main)'
              }}>
                <Clock size={14} /> {getTimeElapsed(order.timestamp)}
              </div>
            </div>

            <div style={{padding: '1.5rem', flex: 1}}>
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                {(order.items || []).map((item, idx) => (
                  <li key={idx} style={{
                    display: 'flex', 
                    gap: '1rem', 
                    padding: '0.8rem 0',
                    borderBottom: idx === order.items.length - 1 ? 'none' : '1px dashed var(--border)'
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'var(--primary-soft)', color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.9rem'
                    }}>
                      {item.qty}
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: 700, fontSize: '1rem'}}>{item.name}</div>
                      {item.selectedVariant && (
                        <div style={{fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600}}>
                          {item.selectedVariant}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {order.notes && (
                <div style={{
                  marginTop: '1.5rem', padding: '1rem', 
                  background: 'var(--bg-app)', borderRadius: '16px',
                  fontSize: '0.9rem', color: 'var(--text-muted)',
                  border: '1px solid var(--border)'
                }}>
                  <strong style={{color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem'}}>Catatan:</strong>
                  {order.notes}
                </div>
              )}
            </div>

            <div style={{padding: '1.5rem', background: 'var(--bg-app)'}}>
              {order.status === 'preparing' ? (
                <button 
                  onClick={() => updateStatus(order.id, 'ready')}
                  style={{
                    width: '100%', padding: '1.2rem', borderRadius: '16px',
                    background: 'var(--primary)', color: 'white', fontWeight: 800,
                    border: 'none', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    boxShadow: '0 10px 20px -5px var(--primary-soft)'
                  }}
                >
                  <Play size={20} /> TANDAI SIAP SAJI
                </button>
              ) : (
                <button 
                  onClick={() => updateStatus(order.id, 'completed')}
                  style={{
                    width: '100%', padding: '1.2rem', borderRadius: '16px',
                    background: 'var(--success)', color: 'white', fontWeight: 800,
                    border: 'none', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
                  }}
                >
                  <CheckCircle2 size={20} /> PESANAN DIAMBIL
                </button>
              )}
            </div>
          </div>
        ))}
        {orders.filter(o => o.status === filter).length === 0 && (
          <div style={{
            gridColumn: '1 / -1', 
            padding: '5rem', 
            textAlign: 'center', 
            opacity: 0.3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <Utensils size={64} />
            <div style={{fontSize: '1.5rem', fontWeight: 700}}>Belum ada pesanan {filter === 'preparing' ? 'masuk' : 'selesai'}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KitchenDisplay;
