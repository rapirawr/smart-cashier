import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { 
  DollarSign, Package, Tag, Users, TrendingUp, TrendingDown, 
  CreditCard, Trophy, BarChart3, Diamond, AlertTriangle, ChefHat, CheckCircle
} from 'lucide-react';

const COLORS = ['var(--primary)', '#22c55e', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6', '#ec4899', '#14b8a6'];

function Dashboard({ settings }) {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [members, setMembers] = useState([]);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const load = async () => {
      const [
        { data: txs },
        { data: prods },
        { data: mems }
      ] = await Promise.all([
        supabase.from('transactions').select('*').order('timestamp', { ascending: false }),
        supabase.from('products').select('*'),
        supabase.from('members').select('*')
      ]);
      
      if (txs) setTransactions(txs);
      if (prods) setProducts(prods);
      if (mems) setMembers(mems);
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today); monthAgo.setMonth(monthAgo.getMonth() - 1);
    const prevWeekStart = new Date(weekAgo); prevWeekStart.setDate(prevWeekStart.getDate() - 7);

    const todayTxs = transactions.filter(t => new Date(t.timestamp) >= today);
    const yesterdayTxs = transactions.filter(t => {
      const d = new Date(t.timestamp);
      return d >= yesterday && d < today;
    });
    const weekTxs = transactions.filter(t => new Date(t.timestamp) >= weekAgo);
    const prevWeekTxs = transactions.filter(t => {
      const d = new Date(t.timestamp);
      return d >= prevWeekStart && d < weekAgo;
    });
    const monthTxs = transactions.filter(t => new Date(t.timestamp) >= monthAgo);

    const todayRevenue = todayTxs.reduce((s, t) => s + t.total, 0);
    const yesterdayRevenue = yesterdayTxs.reduce((s, t) => s + t.total, 0);
    const weekRevenue = weekTxs.reduce((s, t) => s + t.total, 0);
    const prevWeekRevenue = prevWeekTxs.reduce((s, t) => s + t.total, 0);
    const monthRevenue = monthTxs.reduce((s, t) => s + t.total, 0);

    const dayGrowth = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100) : 0;
    const weekGrowth = prevWeekRevenue > 0 ? ((weekRevenue - prevWeekRevenue) / prevWeekRevenue * 100) : 0;

    return {
      todayRevenue, weekRevenue, monthRevenue,
      todayCount: todayTxs.length,
      weekCount: weekTxs.length,
      monthCount: monthTxs.length,
      totalProducts: products.length,
      lowStock: products.filter(p => p.stock < 10).length,
      totalMembers: members.length,
      avgTransaction: monthTxs.length > 0 ? monthRevenue / monthTxs.length : 0,
      dayGrowth, weekGrowth,
      preparingCount: transactions.filter(t => t.status === 'preparing').length,
      readyCount: transactions.filter(t => t.status === 'ready').length
    };
  }, [transactions, products, members]);

  const chartData = useMemo(() => {
    const now = new Date();
    let days = 7;
    if (timeRange === 'month') days = 30;
    if (timeRange === 'today') days = 1;

    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);

      const dayTxs = transactions.filter(t => {
        const d = new Date(t.timestamp);
        return d >= dayStart && d < dayEnd;
      });

      data.push({
        name: days === 1 
          ? `${date.getHours()}:00`
          : date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
        revenue: dayTxs.reduce((s, t) => s + t.total, 0),
        count: dayTxs.length
      });
    }
    return data;
  }, [transactions, timeRange]);

  const topProducts = useMemo(() => {
    const productMap = {};
    transactions.forEach(t => {
      (t.items || []).forEach(item => {
        const key = item.name;
        if (!productMap[key]) productMap[key] = { name: key, qty: 0, revenue: 0 };
        productMap[key].qty += item.qty;
        productMap[key].revenue += item.qty * item.price;
      });
    });
    return Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 4);
  }, [transactions]);

  const paymentBreakdown = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const method = t.payment_method || 'Cash';
      if (!map[method]) map[method] = { name: method, value: 0, count: 0 };
      map[method].value += t.total;
      map[method].count += 1;
    });
    return Object.values(map);
  }, [transactions]);

  const formatCurrency = (val) => `Rp ${val.toLocaleString('id-ID')}`;

  return (
    <div className="dashboard-container">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{'--card-accent': 'var(--primary)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div className="stat-icon" style={{background: 'var(--primary-soft)', color: 'var(--primary)'}}><DollarSign size={24} /></div>
            <div className="stat-trend" style={{
              background: stats.dayGrowth >= 0 ? 'var(--success-soft)' : 'var(--danger-soft)',
              color: stats.dayGrowth >= 0 ? 'var(--success)' : 'var(--danger)'
            }}>
              {stats.dayGrowth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(stats.dayGrowth).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="stat-value">{formatCurrency(stats.todayRevenue)}</div>
            <div className="stat-label">Pendapatan Hari Ini</div>
          </div>
        </div>

        <div className="stat-card" style={{'--card-accent': 'var(--success)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div className="stat-icon" style={{background: 'var(--success-soft)', color: 'var(--success)'}}><Package size={24} /></div>
            <div className="stat-trend" style={{background: 'var(--info-soft)', color: 'var(--info)'}}>
              {stats.todayCount} hari ini
            </div>
          </div>
          <div>
            <div className="stat-value">{stats.weekCount}</div>
            <div className="stat-label">Transaksi Minggu Ini</div>
          </div>
        </div>

        <div className="stat-card" style={{'--card-accent': 'var(--warning)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div className="stat-icon" style={{background: 'var(--warning-soft)', color: 'var(--warning)'}}><Tag size={24} /></div>
            {stats.lowStock > 0 && (
              <div className="stat-trend" style={{background: 'var(--danger-soft)', color: 'var(--danger)'}}>
                <AlertTriangle size={14} style={{marginRight: '4px'}} /> {stats.lowStock} menipis
              </div>
            )}
          </div>
          <div>
            <div className="stat-value">{stats.totalProducts}</div>
            <div className="stat-label">Total Produk Aktif</div>
          </div>
        </div>

        <div className="stat-card" style={{'--card-accent': '#8b5cf6'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div className="stat-icon" style={{background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6'}}><Users size={24} /></div>
            <div className="stat-trend" style={{background: 'var(--primary-soft)', color: 'var(--primary)'}}>
              {formatCurrency(stats.avgTransaction)}
            </div>
          </div>
          <div>
            <div className="stat-value">{stats.totalMembers}</div>
            <div className="stat-label">Total Member & Rata²</div>
          </div>
        </div>

        <div className="stat-card" style={{'--card-accent': '#ec4899'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div className="stat-icon" style={{background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899'}}><ChefHat size={24} /></div>
            <div className="stat-trend" style={{background: stats.preparingCount > 5 ? 'var(--danger-soft)' : 'var(--success-soft)', color: stats.preparingCount > 5 ? 'var(--danger)' : 'var(--success)'}}>
              {stats.preparingCount > 5 ? 'Padat' : 'Normal'}
            </div>
          </div>
          <div>
            <div className="stat-value">{stats.preparingCount}</div>
            <div className="stat-label">Pesanan di Dapur</div>
          </div>
        </div>

        <div className="stat-card" style={{'--card-accent': '#14b8a6'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div className="stat-icon" style={{background: 'rgba(20, 184, 166, 0.1)', color: '#14b8a6'}}><CheckCircle size={24} /></div>
            <div className="stat-trend" style={{background: 'var(--info-soft)', color: 'var(--info)'}}>
              {stats.readyCount > 0 ? 'Siap!' : 'Kosong'}
            </div>
          </div>
          <div>
            <div className="stat-value">{stats.readyCount}</div>
            <div className="stat-label">Siap Diambil</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="dashboard-grid-2-1">
        {/* Revenue Chart */}
        <div className="chart-section">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h3 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem'}}><TrendingUp size={20} /> Grafik Pendapatan</h3>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              {['today', 'week', 'month'].map(r => (
                <button key={r} className={`filter-chip ${timeRange === r ? 'active' : ''}`}
                  onClick={() => setTimeRange(r)}>
                  {r === 'today' ? 'Hari Ini' : r === 'week' ? '7 Hari' : '30 Hari'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
              <YAxis tick={{fill: 'var(--text-muted)', fontSize: 12}} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '16px', boxShadow: 'var(--shadow-lg)'
                }}
                formatter={(value) => [formatCurrency(value), 'Pendapatan']}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Breakdown */}
        <div className="chart-section">
          <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CreditCard size={20} /> Metode Pembayaran</h3>
          {paymentBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={paymentBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                    {paymentBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem'}}>
                {paymentBreakdown.map((p, i) => (
                  <div key={p.name} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{width: 12, height: 12, borderRadius: 4, background: COLORS[i % COLORS.length]}} />
                      <span style={{fontWeight: 600}}>{p.name}</span>
                    </div>
                    <span style={{color: 'var(--text-muted)', fontWeight: 600}}>{p.count}x</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3}}>
              <p>Belum ada data</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="dashboard-grid-1-1">
        <div className="chart-section">
          <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Trophy size={20} /> Produk Terlaris</h3>
          <div className="top-products-list">
            {topProducts.length === 0 ? (
              <div style={{padding: '3rem', textAlign: 'center', opacity: 0.3}}>
                <p style={{fontWeight: 600}}>Belum ada data penjualan</p>
              </div>
            ) : topProducts.map((p, i) => (
              <div key={p.name} className="top-product-item">
                <div className="top-product-rank" style={{
                  background: i < 3 ? ['#fef3c7', '#f1f5f9', '#fed7aa'][i] : 'var(--bg-card)',
                  color: i < 3 ? ['#d97706', '#64748b', '#ea580c'][i] : 'var(--text-muted)'
                }}>
                  {i + 1}
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 700, fontSize: '0.95rem'}}>{p.name}</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{p.qty} terjual</div>
                </div>
                <div style={{fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem'}}>
                  {formatCurrency(p.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Product Bar Chart */}
        <div className="chart-section">
          <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><BarChart3 size={20} /> Pendapatan per Produk</h3>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts.slice(0, 4)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{fill: 'var(--text-muted)', fontSize: 11}} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <YAxis dataKey="name" type="category" width={100} tick={{fill: 'var(--text-main)', fontSize: 12, fontWeight: 600}} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                  {topProducts.slice(0, 4).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3}}>
              <p>Belum ada data</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Revenue Card */}
      <div className="chart-section" style={{
        background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
        border: 'none', color: 'white'
      }}>
        <div className="revenue-card-inner">
          <div>
            <h3 style={{color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Diamond size={18} /> Total Pendapatan Bulan Ini</h3>
            <div style={{fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.02em'}}>
              {formatCurrency(stats.monthRevenue)}
            </div>
            <p style={{opacity: 0.7, marginTop: '0.5rem'}}>{stats.monthCount} transaksi dalam 30 hari terakhir</p>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '1rem 1.5rem', borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.3rem'}}>Pertumbuhan Mingguan</div>
              <div style={{fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                {stats.weekGrowth >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                {Math.abs(stats.weekGrowth).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
