 import React, { useState, useEffect, useCallback } from 'react';
import './Chart.css';

const DISTRICT_STATS = {
  municipalities: [
    { name: 'कालिन्चोक', count: 85, tokens: 8 },
    { name: 'गौरीशंकर', count: 55, tokens: 5 },
    { name: 'जिरी', count: 110, tokens: 10 },
    { name: 'तामाकोशी', count: 95, tokens: 9 },
    { name: 'बिगु', count: 130, tokens: 12 },
    { name: 'भिमेश्वर', count: 355, tokens: 30 },
    { name: 'मेलुङ', count: 28, tokens: 3 },
    { name: 'वैतेश्वर', count: 108, tokens: 10 },
    { name: 'शैलुङ', count: 78, tokens: 7 },
  ],
  trend: [
    { date: '2083-01-02', count: 42, tokens: 4 },
    { date: '2083-01-03', count: 78, tokens: 7 },
    { date: '2083-01-04', count: 75, tokens: 6 },
    { date: '2083-01-05', count: 30, tokens: 3 },
    { date: '2083-01-06', count: 128, tokens: 12 },
    { date: '2083-01-07', count: 120, tokens: 11 },
    { date: '2083-01-08', count: 196, tokens: 18 },
    { date: '2083-01-09', count: 100, tokens: 9 },
    { date: '2083-01-10', count: 230, tokens: 22 },
    { date: '2083-01-11', count: 132, tokens: 13 },
  ]
};

const BarChartMini = ({ data }) => {
  const max = Math.max(...data.map(d => d.count));
  const w = 700, h = 240, pb = 64, pt = 16, pl = 48, pr = 16;
  const bw = Math.max(2, Math.floor((w - pl - pr) / data.length) - 6);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="barBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(99,179,237,1)" />
          <stop offset="100%" stopColor="rgba(66,153,225,0.6)" />
        </linearGradient>
        <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(72,233,189,1)" />
          <stop offset="100%" stopColor="rgba(56,189,168,0.6)" />
        </linearGradient>
      </defs>
      {[0, 100, 200, 300, 400].filter(v => v <= max).map(v => (
        <g key={v}>
          <line
            x1={pl} x2={w - pr}
            y1={pt + (h - pt - pb) * (1 - v / max)}
            y2={pt + (h - pt - pb) * (1 - v / max)}
            stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4"
          />
          <text
            x={pl - 6} y={pt + (h - pt - pb) * (1 - v / max) + 4}
            fontSize="10" fill="rgba(255,255,255,0.45)" textAnchor="end"
          >{v}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = pl + i * ((w - pl - pr) / data.length) + 2;
        const bh = Math.max(4, ((h - pt - pb) * d.count / max));
        const y = pt + (h - pt - pb) - bh;
        const tokenH = Math.max(2, bh * (d.tokens / d.count));
        return (
          <g key={i} className="bar-group">
            <rect x={x} y={y} width={bw} height={bh} fill="url(#barBlue)" rx="4" opacity="0.85" />
            <rect x={x} y={y + bh - tokenH} width={bw} height={tokenH} fill="url(#barGreen)" rx="4" opacity="0.9" />
            <text
              x={x + bw / 2} y={h - pb + 16}
              fontSize="8.5" fill="rgba(255,255,255,0.65)" textAnchor="middle"
              transform={`rotate(-38, ${x + bw / 2}, ${h - pb + 16})`}
            >{d.name}</text>
          </g>
        );
      })}
      <rect x={pl + 8} y={h - 14} width="10" height="10" fill="url(#barBlue)" rx="2" />
      <text x={pl + 22} y={h - 6} fontSize="10" fill="rgba(99,179,237,0.9)">Total Establishments</text>
      <rect x={pl + 155} y={h - 14} width="10" height="10" fill="url(#barGreen)" rx="2" />
      <text x={pl + 169} y={h - 6} fontSize="10" fill="rgba(72,233,189,0.9)">eCensus Tokens</text>
    </svg>
  );
};

const LineChartMini = ({ data, type = 'count' }) => {
  const values = data.map(d => type === 'count' ? d.count : d.tokens);
  const max = Math.max(...values, 1);
  const w = 700, h = 240, pb = 50, pt = 18, pl = 48, pr = 18;
  const color = type === 'count' ? 'rgba(99,179,237,1)' : 'rgba(72,233,189,1)';
  const dotColor = type === 'count' ? '#f56565' : '#38e5c1';
  const gradId = type === 'count' ? 'lgCount' : 'lgToken';

  if (data.length === 0) return null;

  const xs = data.map((_, i) => pl + i * ((w - pl - pr) / (data.length - 1)));
  const ys = data.map(d => pt + (h - pt - pb) * (1 - (type === 'count' ? d.count : d.tokens) / (max * 1.1)));
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const fill = `${path} L${xs[xs.length - 1]},${h - pb} L${xs[0]},${h - pb} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color.replace('1)', '0.3)')} />
          <stop offset="100%" stopColor={color.replace('1)', '0)')} />
        </linearGradient>
      </defs>
      {[0, Math.floor(max / 2), max].map(v => (
        <g key={v}>
          <line
            x1={pl} x2={w - pr}
            y1={pt + (h - pt - pb) * (1 - v / (max * 1.1))}
            y2={pt + (h - pt - pb) * (1 - v / (max * 1.1))}
            stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4"
          />
          <text
            x={pl - 6} y={pt + (h - pt - pb) * (1 - v / (max * 1.1)) + 4}
            fontSize="10" fill="rgba(255,255,255,0.4)" textAnchor="end"
          >{v}</text>
        </g>
      ))}
      <path d={fill} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {xs.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={ys[i]} r="5" fill={dotColor} stroke="white" strokeWidth="2" />
          <title>{`${data[i].date}: ${values[i]}`}</title>
        </g>
      ))}
      {data.map((d, i) => (
        <text
          key={i} x={xs[i]} y={h - pb + 14}
          fontSize="9" fill="rgba(255,255,255,0.5)" textAnchor="middle"
          transform={`rotate(-38, ${xs[i]}, ${h - pb + 14})`}
        >{d.date.slice(5)}</text>
      ))}
    </svg>
  );
};

const Chart = () => {
  const [todayStats, setTodayStats] = useState({ totalCounts: 0, eCensusTokens: 0 });
  const [activeTab, setActiveTab] = useState('establishments');

  const calculateTodayStats = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    let total = 0, tokens = 0;
    try {
      const passwordSystem = JSON.parse(localStorage.getItem('passwordSystem') || '{}');
      const empIds = Object.keys(passwordSystem).filter(id => id !== 'ADMIN');
      for (const empId of empIds) {
        const data = JSON.parse(localStorage.getItem(`workData_${empId}`) || '[]');
        const todayEntries = data.filter(e => e.date === today);
        total += todayEntries.reduce((s, e) => s + (parseInt(e.totalCount) || 0), 0);
        tokens += todayEntries.filter(e => e.censusToken).length;
      }
    } catch (_) {}
    return { totalCounts: total, eCensusTokens: tokens };
  }, []);

  useEffect(() => {
    setTodayStats(calculateTodayStats());
    const interval = setInterval(() => setTodayStats(calculateTodayStats()), 30000);
    return () => clearInterval(interval);
  }, [calculateTodayStats]);

  const totalEstablishments = DISTRICT_STATS.municipalities.reduce((s, m) => s + m.count, 0);
  const totalTokens = DISTRICT_STATS.municipalities.reduce((s, m) => s + m.tokens, 0);
  const totalMunicipalities = DISTRICT_STATS.municipalities.length;

  return (
    <div className="live-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="nepal-flag">🇳🇵</div>
          <div className="header-text">
            <span className="govt-label">Government of Nepal</span>
            <h1 className="office-title">District Economic Census Office</h1>
            <span className="office-sub">Dolakha, Nepal</span>
          </div>
        </div>
        <div className="header-right">
          <div className="live-badge">
            <span className="live-dot" />
            LIVE
          </div>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="stats-row">
        <div className="stat-card today-card">
          <div className="stat-icon">📅</div>
          <div>
            <div className="stat-value">{todayStats.totalCounts.toLocaleString()}</div>
            <div className="stat-label">Today's Total Counts</div>
          </div>
        </div>
        <div className="stat-card token-card">
          <div className="stat-icon">🎫</div>
          <div>
            <div className="stat-value">{todayStats.eCensusTokens}</div>
            <div className="stat-label">Today's e-Census Tokens</div>
          </div>
        </div>
        <div className="stat-card info-card">
          <div className="stat-icon">🏢</div>
          <div>
            <div className="stat-value">{totalEstablishments.toLocaleString()}</div>
            <div className="stat-label">Total Establishments</div>
          </div>
        </div>
        <div className="stat-card info-card">
          <div className="stat-icon">🎟️</div>
          <div>
            <div className="stat-value">{totalTokens}</div>
            <div className="stat-label">Total eCensus Tokens</div>
          </div>
        </div>
        <div className="stat-card muni-card">
          <div className="stat-icon">📍</div>
          <div>
            <div className="stat-value">{totalMunicipalities}</div>
            <div className="stat-label">Municipalities</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Bar Chart — full width */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <span className="chart-icon">📊</span>
            <span className="chart-title">Total Establishments by Municipality</span>
          </div>
          <div className="chart-body">
            <BarChartMini data={DISTRICT_STATS.municipalities} />
          </div>
        </div>

        {/* Trend Charts Side by Side */}
        <div className="chart-card half-width">
          <div className="chart-header">
            <span className="chart-icon">📈</span>
            <span className="chart-title">District Census Trend</span>
            <span className="chart-badge blue">Last 10 days</span>
          </div>
          <div className="chart-body">
            <LineChartMini data={DISTRICT_STATS.trend} type="count" />
          </div>
        </div>

        <div className="chart-card half-width">
          <div className="chart-header">
            <span className="chart-icon">🎫</span>
            <span className="chart-title">eCensus Token Trend</span>
            <span className="chart-badge green">Last 10 days</span>
          </div>
          <div className="chart-body">
            <LineChartMini data={DISTRICT_STATS.trend} type="token" />
          </div>
        </div>
      </div>

      {/* Municipality Table */}
      <div className="table-card">
        <div className="chart-header">
          <span className="chart-icon">📋</span>
          <span className="chart-title">Municipality-wise Summary</span>
        </div>
        <div className="table-wrapper">
          <table className="muni-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Municipality</th>
                <th>Establishments</th>
                <th>eCensus Tokens</th>
                <th>Coverage</th>
              </tr>
            </thead>
            <tbody>
              {DISTRICT_STATS.municipalities.map((m, i) => {
                const pct = Math.round((m.tokens / m.count) * 100);
                return (
                  <tr key={i}>
                    <td className="td-num">{i + 1}</td>
                    <td className="td-name">{m.name}</td>
                    <td className="td-count">{m.count}</td>
                    <td className="td-token">{m.tokens}</td>
                    <td className="td-bar">
                      <div className="progress-wrap">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                        <span className="progress-label">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <span>District Economic Census Office, Dolakha</span>
        <span className="footer-sep">·</span>
        <span>Data refreshes every 30 seconds</span>
        <span className="footer-sep">·</span>
        <span>Nepal Rastra Bank ©2083 B.S.</span>
      </div>
    </div>
  );
};

export default Chart;